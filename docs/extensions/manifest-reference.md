---
sidebar_position: 6
---

# Manifest Reference

Every extension folder contains a **`neatcontext-extension.json`** manifest that
identifies the extension, declares how it authenticates, and tells NeatContext how
to launch its MCP server.

## Example

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
      { "key": "baseUrl", "label": "Base URL", "secret": false, "required": false, "placeholder": "https://logs.acme.internal" }
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

## Top-level fields

### `id` (string, required)

Stable, unique identifier: lowercase letters, numbers, and hyphens (e.g.
`acme-logs`). Used to track the extension, to store its connection, and in the
OAuth redirect URI — keep it stable across versions. Ids of bundled first-party
extensions (`pagerduty`, `datadog`) cannot be reused.

### `name` (string, required)

Human-readable name shown in the Extensions UI and in connection messages
("Connect Acme Logs").

### `version`, `description`, `publisher` (strings)

Shown to users deciding whether to enable the extension. Bump `version` when you
ship changes.

### `connection` (object)

How the extension authenticates — see [Connection kinds](#connection-kinds).
Omitting it means `{ "kind": "none" }`.

### `mcpServer` (object)

How NeatContext launches the extension's MCP server.

| Field | Type | Meaning |
|---|---|---|
| `transport` | string | Only `"stdio"` is supported: the server is spawned and exchanges `Content-Length`-framed JSON-RPC over stdin/stdout. |
| `command` | string | Executable to run. `"node"` is special-cased: it runs on NeatContext's **bundled Node runtime**, so users don't need Node installed. Other commands (`python`, a native binary) must exist on the user's machine. |
| `args` | string[] | Arguments, e.g. `["./server.cjs"]`. Relative paths resolve against the extension folder. |
| `requiresConnection` | boolean | When `true`, NeatContext resolves the user's connection and pushes the [`neatcontext/connection` handshake](#the-connection-handshake) right after `initialize` on every tool call. Use `false` (the default) with `connection: none`. |

The server is spawned **fresh for each `tools/list` and each `tools/call`** —
keep it stateless, and make `tools/list` work without credentials.

### `allowed_profiles` (string[])

Restricts the extension to specific domain profiles by id. An **empty array**
means no restriction.

## Connection kinds

### `none`

```json
"connection": { "kind": "none" }
```

No authentication and no connection UI. Use for local systems or endpoints the
server reaches without user credentials.
[Guide: Build Your First Extension](./building-extensions.md).

### `api_key` and `bearer`

```json
"connection": {
  "kind": "api_key",
  "label": "Acme Logs (read)",
  "fields": [
    { "key": "apiKey", "label": "API key", "secret": true },
    { "key": "baseUrl", "label": "Base URL", "secret": false, "required": false, "placeholder": "https://logs.acme.internal" }
  ],
  "config": { "apiVersion": "v2" }
}
```

The user pastes credentials into an **inline form generated from `fields`**.
Secret values are encrypted with the OS secure storage; required fields are
validated before saving, with errors shown inline on the card. The two kinds are
mechanically identical — pick the one that describes the credential.
[Guide: API-Key Extensions](./api-key-extensions.md).

Each entry in `fields`:

| Property | Type | Default | Meaning |
|---|---|---|---|
| `key` | string | — (required) | Property name your server reads from the payload. |
| `label` | string | `key` | Input label; also used in validation messages. |
| `secret` | boolean | `true` | `true`: password input, encrypted at rest, delivered in the payload's `values`. `false`: plain input, delivered in `config`. |
| `required` | boolean | `true` | `false` allows the field to be blank; blank optional fields are omitted from the payload and the server applies its own default. |
| `placeholder` | string | the label | Hint shown in the empty input. |

### `oauth2_pkce`

```json
"connection": {
  "kind": "oauth2_pkce",
  "label": "Acme Tickets (read)",
  "authorizeUrl": "https://identity.acme.com/oauth/authorize",
  "tokenUrl": "https://identity.acme.com/oauth/token",
  "clientId": "your-oauth-client-id",
  "scopes": ["read"],
  "redirectPort": 48981,
  "config": { "apiBaseUrl": "https://api.acme.com" }
}
```

NeatContext runs the whole Authorization Code + PKCE flow from these parameters:
browser consent, localhost callback, token exchange, encrypted storage, and
automatic refresh before each tool call.
[Guide: OAuth Extensions](./oauth-extensions.md).

| Property | Type | Meaning |
|---|---|---|
| `authorizeUrl` | string (required) | The provider's authorization endpoint. |
| `tokenUrl` | string (required) | The provider's token endpoint (code exchange and refresh). |
| `clientId` | string (required) | Your OAuth app's client id (a **public PKCE client** — no secret is stored). |
| `scopes` | string[] | Scopes to request; prefer the narrowest read-only set. |
| `redirectPort` | number (required) | Fixed localhost port for the callback. The derived redirect URI — register it with the provider **exactly** — is `http://127.0.0.1:<redirectPort>/oauth/<id>/callback`. |

### Shared: `label` and `config`

- `label` (string) — display label for the connection.
- `config` (object of strings) — static, non-secret configuration merged into the
  payload's `config` (API base URL, API version, account settings). Keeps
  environment specifics out of your server code. Never put secrets here — the
  manifest is plain text.

## The connection handshake

When `mcpServer.requiresConnection` is `true` and the user is connected,
NeatContext pushes one notification right after `initialize`:

```json
{
  "jsonrpc": "2.0",
  "method": "neatcontext/connection",
  "params": {
    "extensionId": "<your id>",
    "connection": {
      "kind": "api_key | bearer | oauth2_pkce",
      "values": { "…secret fields, or accessToken for OAuth…": "…" },
      "config": { "…manifest config + non-secret fields (+ scope for OAuth)…": "…", "diagnosticLogPath": "…" }
    }
  }
}
```

- `values` — the decrypted secrets: your secret `fields` keyed by `key`
  (`api_key`/`bearer`), or `{ "accessToken": "…" }` (`oauth2_pkce`, refreshed
  right before injection).
- `config` — the manifest's `config`, plus the user's non-secret field values
  (`api_key`/`bearer`) or the granted `scope` (`oauth2_pkce`), plus a
  `diagnosticLogPath` your server may append troubleshooting logs to (redact
  secrets).

**If the user is not connected, the notification never arrives** — your tools
should detect that and return a connection-required result:

## Terminal results

A tool result (returned as JSON in your text content) can tell NeatContext to
**stop the tool loop** and hand the problem to the user instead of letting the
model retry:

| Result shape | Effect |
|---|---|
| `{ "connection_required": true, "provider": "<id>", "message": "…" }` (plus your own `error` code) | Loop stops; the connected AI client relays `message` as a "connect it first" prompt instead of guessing. Use when credentials are missing or rejected. |
| `{ "error": "<provider>_access_denied", "provider": "<id>", "message": "…", "diagnostic_log": "…" }` | Loop stops with the message (and the log path, if given). Use for permission failures while connected. |
| `{ "error": "…", "message": "…" }` without those markers | **Not** terminal — the model sees the error and may correct itself (fix a query, choose another tool). Use for ordinary failures. |

## Tool naming

Tool names from user extensions **must not** start with `neatcontext_` — that
prefix is reserved for bundled first-party extensions, and prefixed tools from
user extensions are filtered out. Use your own short prefix (`acme_search_logs`).

## Packaging notes

- The manifest and everything the server needs must live in the **same folder**
  you add to NeatContext; the folder is copied as-is into NeatContext's own data
  directory. Keep it lean — don't ship `node_modules/` (prefer Node built-ins and
  the global `fetch`), build outputs, or logs.
- Keep secrets **out** of the manifest and out of the folder entirely. User
  credentials are collected by NeatContext and injected per call; anything else
  the server needs should come from `connection.config` or the environment.

## Related

- **[Extensions Overview](./overview.md)** — architecture and protocol.
- **[Build Your First Extension](./building-extensions.md)** — a complete server.
- **[API-Key Extensions](./api-key-extensions.md)** /
  **[OAuth Extensions](./oauth-extensions.md)** — the two authenticated patterns.
