---
sidebar_position: 1
---

# Extensions Overview

An **extension** gives the model **tools** for your systems — read an incident,
search logs, list deployments, open a ticket, and so on. This page explains the
extension architecture; the next pages walk through
[building one](./building-extensions.md) and the
[manifest reference](./manifest-reference.md).

## What an extension is

An extension is a small program that speaks the **Model Context Protocol (MCP)**. It
advertises a set of **tools** (each with a name, description, and JSON-Schema input)
and executes them when the model calls. NeatContext launches your extension, asks it
what tools it has, and routes tool calls to it during chat.

A NeatContext extension is a folder containing:

- **`neatcontext-extension.json`** — the manifest (id, name, version, how to launch
  the server, whether it needs a connection). See the
  [manifest reference](./manifest-reference.md).
- **the MCP server** — the executable the manifest points at (for example a Node
  script), plus any files it needs.

You add an extension by pointing NeatContext at that folder. It copies the folder
into its own `userData/extensions/` and loads it; enabling the extension makes its
tools available to the model.

## Transport and protocol

The reference transport is **stdio**: NeatContext spawns your server as a
subprocess and exchanges **`Content-Length`-framed JSON-RPC 2.0** messages over
stdin/stdout — the same framing used by the Language Server Protocol. Each message
is:

```text
Content-Length: <byte length of JSON>\r\n
\r\n
<JSON-RPC message>
```

Your server must handle three JSON-RPC methods:

| Method | Purpose |
|---|---|
| `initialize` | Handshake; return your protocol version, capabilities, and server info. |
| `tools/list` | Return the array of tools you expose. |
| `tools/call` | Execute a named tool with the given arguments and return its result. |

Extensions that declare a connection also receive a `neatcontext/connection`
message; connectionless extensions can ignore it.

## Tool naming: the `neatcontext_` prefix is reserved

Tool names from a user (third-party) extension **must not** start with
`neatcontext_`. That prefix is reserved for trusted, bundled first-party
extensions; if a user extension exposes a `neatcontext_`-prefixed tool, that tool is
filtered out. Use your own prefix instead — the demo uses `demo_` (`demo_get_incident`,
`demo_search_logs`, `demo_list_deployments`). A short, unique prefix also helps the
model disambiguate your tools from others.

## Connections

The manifest's `connection.kind` declares whether the extension needs
authentication before its tools work:

- **`none`** — no authentication. The extension talks to systems that need no
  credentials from NeatContext (local systems, or endpoints the extension
  authenticates itself). Enable and go.
- **authenticated** — for services that require NeatContext to establish a
  connection first; the tools become available once the connection is completed.

## Security model

- Extensions run **on your machine**, as a subprocess you added. Treat a
  third-party extension like any other code you run locally — review it first.
- An extension can reach whatever the host machine can. Prefer **read-only** tools
  for investigative connectors, and make any write/destructive tool explicit and
  narrowly scoped.
- Keep secrets out of the manifest and out of tool arguments. Read them from the
  environment or a local config the extension owns.

## Next

- **[Build Your First Extension](./building-extensions.md)** — a complete, annotated
  stdio MCP connector.
- **[Manifest Reference](./manifest-reference.md)** — every field in
  `neatcontext-extension.json`.
