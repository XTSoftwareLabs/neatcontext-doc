---
sidebar_position: 2
---

# Build Your First Extension

This guide builds a complete NeatContext extension from scratch: a stdio MCP server
in Node.js (built-ins only) that exposes one tool. By the end you'll understand the
manifest, the JSON-RPC framing, and the three methods every extension implements.

We'll build a connector called **Status Board** with a single tool,
`board_get_service_status`, that returns a service's current status from an HTTP
endpoint. The same skeleton scales to as many tools as you need — the
[incident demo's](../guides/incident-analysis.md) `server.cjs` is this exact
pattern with three tools.

:::info Prerequisites
Node.js 18+. No npm dependencies are required — everything uses Node built-ins.
:::

## 1. Create the folder and manifest

An extension is a folder with a manifest plus the server it launches. Create:

```text
status-board/
  neatcontext-extension.json
  server.cjs
```

`neatcontext-extension.json`:

```json
{
  "id": "status-board",
  "name": "Status Board",
  "version": "0.1.0",
  "description": "Read the current status of a service from the status board.",
  "publisher": "Your Name",
  "connection": { "kind": "none" },
  "mcpServer": {
    "transport": "stdio",
    "command": "node",
    "args": ["./server.cjs"],
    "requiresConnection": false
  },
  "allowed_profiles": []
}
```

Key points:

- **`connection.kind: "none"`** — no authentication; the server reaches its endpoint
  itself.
- **`mcpServer`** tells NeatContext how to launch the server: run `node ./server.cjs`
  and talk stdio. Paths are relative to the extension folder.
- See the [manifest reference](./manifest-reference.md) for every field.

## 2. The protocol in one picture

NeatContext spawns your server and exchanges **`Content-Length`-framed JSON-RPC 2.0**
messages over stdin/stdout:

```text
Content-Length: 57\r\n
\r\n
{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

You implement three methods — `initialize`, `tools/list`, `tools/call` — and reply
to each request `id` with a matching result.

## 3. Write the server

`server.cjs`:

```js
#!/usr/bin/env node
"use strict";

const https = require("node:https");

// Where this connector reads from. Keep endpoints/secrets in the environment,
// never in the manifest or in tool arguments.
const STATUS_BASE = process.env.STATUS_BOARD_BASE || "https://status.example.com";

// --- Tool definitions -----------------------------------------------------
const tools = [
  {
    name: "board_get_service_status", // NOTE: never prefix with `neatcontext_`
    description:
      "Get the current status of a service from the status board. " +
      "Use when asked whether a service is healthy or degraded.",
    inputSchema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          description: "Service name, e.g. checkout-api.",
        },
      },
      required: ["service"],
      additionalProperties: false,
    },
  },
];

// --- Content-Length framed JSON-RPC over stdio ----------------------------
let buffer = Buffer.alloc(0);

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  readFrames();
});

function readFrames() {
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) return; // wait for the full header
    const header = buffer.slice(0, headerEnd).toString("utf8");
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.slice(headerEnd + 4);
      continue;
    }
    const length = Number(match[1]);
    const start = headerEnd + 4;
    const end = start + length;
    if (buffer.length < end) return; // wait for the full body
    const message = JSON.parse(buffer.slice(start, end).toString("utf8"));
    buffer = buffer.slice(end);
    void handleMessage(message);
  }
}

function send(message) {
  const body = JSON.stringify(message);
  process.stdout.write(
    `Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`
  );
}

// --- Method dispatch ------------------------------------------------------
async function handleMessage(request) {
  // Connectionless extensions can ignore the connection handshake.
  if (request.method === "neatcontext/connection") return;
  // Ignore notifications (messages without an id).
  if (typeof request.id !== "number" && typeof request.id !== "string") return;

  try {
    if (request.method === "initialize") {
      send({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "status-board", version: "0.1.0" },
        },
      });
      return;
    }

    if (request.method === "tools/list") {
      send({ jsonrpc: "2.0", id: request.id, result: { tools } });
      return;
    }

    if (request.method === "tools/call") {
      const result = await handleToolCall(request.params || {});
      send({
        jsonrpc: "2.0",
        id: request.id,
        result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] },
      });
      return;
    }

    send({
      jsonrpc: "2.0",
      id: request.id,
      error: { code: -32601, message: `Unknown method: ${request.method}` },
    });
  } catch (error) {
    send({
      jsonrpc: "2.0",
      id: request.id,
      error: { code: -32603, message: error?.message || "Tool failed." },
    });
  }
}

// --- Tool implementation --------------------------------------------------
async function handleToolCall(params) {
  const args = params.arguments || {};
  if (params.name === "board_get_service_status") {
    const service = String(args.service || "").trim();
    if (!service) throw new Error('Tool argument "service" is required.');
    return getStatus(service);
  }
  return { error: "unknown_tool", message: `Unknown tool: ${params.name}` };
}

function getStatus(service) {
  return new Promise((resolve, reject) => {
    const url = `${STATUS_BASE}/status/${encodeURIComponent(service)}`;
    const req = https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode < 200 || res.statusCode >= 300) {
          resolve({ error: "status_error", status: res.statusCode, body: body.slice(0, 500) });
        } else {
          resolve(body ? JSON.parse(body) : {});
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => req.destroy(new Error("request timed out after 10s")));
  });
}
```

### What each part does

- **Framing (`readFrames`/`send`)** — reads `Content-Length`-prefixed JSON messages
  and writes replies the same way. This is boilerplate you can reuse for any
  extension.
- **`initialize`** — returns your protocol version, capabilities, and server info.
- **`tools/list`** — returns the `tools` array. Each tool's `description` and
  `inputSchema` are how the model decides when and how to call it — write them
  carefully.
- **`tools/call`** — dispatches by `params.name`, validates arguments, does the work,
  and returns a **text content** result. Return structured JSON as text so the model
  can read the fields.
- **Errors** — reply with a JSON-RPC `error` for protocol failures; for expected
  tool-level problems (service down, not found), it's often better to return a
  descriptive result object so the model can react and retry.

## 4. Write great tool descriptions

The model only knows what your `description` and `inputSchema` tell it. Effective
descriptions:

- say **what the tool returns** and **when to use it** ("Use after reading an
  incident to inspect error logs…");
- give **concrete argument examples** in each property's `description`
  (`"ISO start time, e.g. 2026-06-30T09:00:00Z."`);
- set `additionalProperties: false` and mark truly-required args in `required`.

## 5. Load and test it

1. In NeatContext, open **Extensions → Add extension** and select your
   `status-board/` folder.
2. **Enable** it. With `connection: none` there's nothing to authenticate.
3. In a chat with a tool-calling model, ask: *"Is checkout-api healthy right now?"*
   The model should call `board_get_service_status` and answer from the result.

If a tool doesn't get called, check that your model is tool-calling capable, that
`tools/list` returns the tool, and that the description makes its purpose obvious.

## 6. Point it at real systems

Because endpoints come from environment variables (`STATUS_BOARD_BASE` here), the
same extension works against staging or production without code changes. The
incident demo uses the same approach with `NEATCONTEXT_DEMO_*_BASE` variables so its
one connector can target either the local mock systems or your real ones.

## Next

- **[Manifest Reference](./manifest-reference.md)** — every field in
  `neatcontext-extension.json`.
- Study the demo's full three-tool connector in the
  [Incident Analysis walkthrough](../guides/incident-analysis.md).
