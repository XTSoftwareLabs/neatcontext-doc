---
sidebar_position: 3
---

# Manifest Reference

Every extension folder contains a **`neatcontext-extension.json`** manifest that
identifies the extension and tells NeatContext how to launch its MCP server.

## Example

```json
{
  "id": "ops-demo-systems",
  "name": "Ops Demo Systems",
  "version": "0.1.0",
  "description": "Read incidents, logs, and deployments from the demo systems.",
  "publisher": "NeatContext Demo",
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

## Fields

### `id` (string, required)

Stable, unique identifier for the extension, kebab-case (e.g. `status-board`). Used
internally to track the extension; keep it stable across versions.

### `name` (string, required)

Human-readable name shown in the Extensions UI (e.g. `Status Board`).

### `version` (string, required)

The extension's version, typically semver (e.g. `0.1.0`). Bump it when you ship
changes.

### `description` (string, required)

Short explanation of what the extension does, shown to users deciding whether to
enable it.

### `publisher` (string)

Who authored/publishes the extension.

### `connection` (object, required)

Declares whether the extension needs authentication before its tools are usable.

- **`kind`** — `"none"` for connectors that need no credentials from NeatContext
  (local systems, or endpoints the server authenticates itself). Other kinds
  describe authenticated connections whose tools become available only after the
  connection is completed.

### `mcpServer` (object, required)

How NeatContext launches the extension's MCP server.

| Field | Type | Meaning |
|---|---|---|
| `transport` | string | Transport to use. `"stdio"` spawns the server and exchanges `Content-Length`-framed JSON-RPC over stdin/stdout. |
| `command` | string | Executable to run, e.g. `"node"`. |
| `args` | string[] | Arguments to the command, e.g. `["./server.cjs"]`. Paths are relative to the extension folder. |
| `requiresConnection` | boolean | Whether the server should only start once a connection is established. Use `false` for `connection: none`. |

### `allowed_profiles` (string[])

Restricts the extension to specific domain profiles by id. An **empty array** means
no restriction — the extension is available regardless of the active profile.

## Packaging notes

- The manifest and the server it points at must live in the **same folder** you add
  to NeatContext. NeatContext copies that folder into its own
  `userData/extensions/`.
- Ship only what the extension needs. Add a **`.domaincopilotignore`** file (same
  syntax as `.gitignore`) to exclude things like `node_modules/` and `*.log`.
- Keep secrets **out** of the manifest. Read endpoints and credentials from the
  environment inside the server.

## Related

- **[Extensions Overview](./overview.md)** — architecture and protocol.
- **[Build Your First Extension](./building-extensions.md)** — a complete server.
