---
sidebar_position: 3
---

# API-Key Extensions

Most internal systems and many SaaS APIs (Datadog, Grafana, Elasticsearch, your
own services) authenticate with **keys or tokens the user pastes in**. This guide
adds that to an extension, step by step. The bundled **Datadog** extension is the
reference implementation of this pattern — open its folder from the Extensions
page (folder icon on the card) to read the full source.

What you get by declaring an `api_key` connection:

- NeatContext renders an **inline credentials form** on your extension's card,
  generated from the fields you declare — you write no UI.
- **Connect** validates required fields (missing ones are reported inline, next to
  the form) and stores the values **encrypted with the OS secure storage**. They
  are never written to your extension's folder and never shown again.
- Before every tool call, the decrypted values are **injected into your server**
  over the `neatcontext/connection` handshake.

:::info[Prerequisites]
Read [Build Your First Extension](./building-extensions.md) first — this guide
reuses its folder layout, JSON-RPC framing, and method dispatch, and only shows
what changes for authentication.
:::

## 1. Declare the connection in the manifest

We'll build **Acme Logs**, a connector that searches your log platform with an
API key. The manifest declares the form:

```json
{
  "id": "acme-logs",
  "name": "Acme Logs",
  "version": "0.1.0",
  "description": "Read-only log search against the Acme log platform.",
  "publisher": "Your Name",
  "connection": {
    "kind": "api_key",
    "label": "Acme Logs (read)",
    "fields": [
      { "key": "apiKey", "label": "API key", "secret": true },
      {
        "key": "baseUrl",
        "label": "Base URL",
        "secret": false,
        "required": false,
        "placeholder": "https://logs.acme.internal"
      }
    ],
    "config": { "apiVersion": "v2" }
  },
  "mcpServer": {
    "transport": "stdio",
    "command": "node",
    "args": ["./server.cjs"],
    "requiresConnection": true
  },
  "allowed_profiles": []
}
```

The pieces that matter:

- **`fields`** drives the form. Each field becomes one input:
  - `secret: true` (the default) renders a password input and is **encrypted** at
    rest; `secret: false` renders plain text and is stored as configuration.
  - `required: false` marks a field optional — the form labels it "(optional)"
    and your server applies its own default when it's absent.
  - `placeholder` is shown in the empty input; use it to hint the expected value
    or the default.
- **`config`** is static, non-secret configuration you (the author) set once in
  the manifest — an API version, a fixed endpoint. It is merged into what your
  server receives, so you don't have to hardcode it in the server.
- **`requiresConnection: true`** tells NeatContext to inject the connection before
  each tool call. Without it, your server never receives the handshake.
- **`kind: "bearer"`** works identically; it's a semantic label for
  token-shaped credentials.

## 2. What the user experiences

On the Extensions page your card shows the form and, until connected, the state
line *"Connection secrets are not saved for this extension."*:

- Clicking **Connect** with a required field empty shows the reason **inline on
  the card** ("API key is required.") — nothing is sent anywhere.
- With the fields filled, Connect encrypts and saves them; the card flips to
  **Connected** with **Reconnect** / **Disconnect** buttons.
- **Reconnect** expects the values to be re-entered (secrets are never displayed
  back). **Disconnect** deletes them.

## 3. Receive the credentials in your server

After `initialize`, and only when the user is connected, NeatContext pushes one
notification:

```json
{
  "jsonrpc": "2.0",
  "method": "neatcontext/connection",
  "params": {
    "extensionId": "acme-logs",
    "connection": {
      "kind": "api_key",
      "values": { "apiKey": "…decrypted secret…" },
      "config": {
        "apiVersion": "v2",
        "baseUrl": "https://logs.eu.acme.internal",
        "diagnosticLogPath": "…\\logs\\acme-logs-tool.log"
      }
    }
  }
}
```

- **`values`** holds the decrypted **secret** fields, keyed by field `key`.
- **`config`** merges your manifest `config`, the user's **non-secret** field
  values (only when provided — optional blanks are omitted), and a host-provided
  `diagnosticLogPath` your server may append troubleshooting logs to.

Handle it by storing the connection in a variable (the process only lives for one
call, so a module-level variable is fine):

```js
// Connection injected by the host; null until the user has connected.
let connection = null;

// In your message dispatch, before the id check:
if (request.method === "neatcontext/connection") {
  applyConnection(request.params);
  return;
}

function applyConnection(params) {
  const incoming = params && params.connection;
  if (!incoming || typeof incoming !== "object") {
    connection = null;
    return;
  }
  const values = incoming.values || {};
  const config = incoming.config || {};
  connection = {
    apiKey: typeof values.apiKey === "string" ? values.apiKey : undefined,
    // The user's optional Base URL wins; otherwise your default.
    baseUrl:
      typeof config.baseUrl === "string" && config.baseUrl.trim()
        ? config.baseUrl.replace(/\/+$/, "")
        : "https://logs.acme.internal",
    apiVersion: config.apiVersion || "v2",
    diagnosticLogPath: config.diagnosticLogPath
  };
}
```

## 4. Use the credentials — and handle the missing/rejected cases

The tool implementation has three outcomes to get right: **not connected**,
**rejected credentials**, and ordinary errors.

```js
async function searchLogs(args) {
  const query = String(args.query || "").trim();
  if (!query) throw new Error('Tool argument "query" is required.');

  // 1. Not connected: no handshake arrived. Return a connection-required
  //    result — NeatContext stops the tool loop, answers the user with your
  //    message, and offers a "Connect Acme Logs" button in the chat.
  if (!connection || !connection.apiKey) {
    return {
      error: "acme_logs_not_connected",
      connection_required: true,
      provider: "acme-logs",
      message: "Connect Acme Logs before searching logs."
    };
  }

  const url = `${connection.baseUrl}/api/${connection.apiVersion}/logs/search`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${connection.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, limit: 20 })
  });

  // 2. Rejected credentials: also terminal, and `connection_required` makes
  //    the Connect button appear so the user can re-enter valid keys.
  if (response.status === 401 || response.status === 403) {
    return {
      error: "acme_logs_access_denied",
      connection_required: true,
      provider: "acme-logs",
      message:
        `Acme Logs denied access (status ${response.status}). ` +
        "Check that the saved API key is valid, then reconnect Acme Logs."
    };
  }

  // 3. Ordinary failures: return a plain error result WITHOUT
  //    connection_required, so the model can adjust (e.g. fix the query)
  //    and retry within the same conversation turn.
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 500);
    return {
      error: "acme_logs_error",
      provider: "acme-logs",
      message: `Log search failed with status ${response.status}: ${detail}`
    };
  }

  const payload = await response.json();
  return { query, logs: payload.results || [] };
}
```

:::warning[Never persist or print secrets]
Credentials arrive per call and must stay in memory. Don't write them to disk,
don't include them in tool results, and redact them from anything you append to
`diagnosticLogPath`.
:::

## 5. Test it

1. **Extensions → Add extension**, select your `acme-logs/` folder, **Enable** it.
2. Click **Connect** with the form empty → the inline "API key is required."
   error appears and nothing is saved.
3. Ask the model something that triggers your tool *before connecting* → the
   answer should be your `message` with a **Connect Acme Logs** button.
4. Fill the form, **Connect**, ask again → the tool should call your backend with
   the key.
5. Enter a wrong key, ask again → the access-denied message and Connect button.

## Field cheat sheet

| Field property | Default | Effect |
|---|---|---|
| `key` | — | Property name in `values`/`config` your server reads. |
| `label` | `key` | Input label; also used in validation messages ("API key is required."). |
| `secret` | `true` | Password input + encrypted at rest + delivered in `values`. `false`: plain input, delivered in `config`. |
| `required` | `true` | `false` allows blank; blank optional fields are omitted from the payload. |
| `placeholder` | label | Hint text in the empty input. |

## Next

- **[OAuth Extensions](./oauth-extensions.md)** — when the service supports
  browser-based sign-in instead of pasted keys.
- **[Manifest Reference](./manifest-reference.md)** — the full connection schema
  and terminal-result contract.
