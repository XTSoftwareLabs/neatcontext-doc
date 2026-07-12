---
sidebar_position: 4
---

# OAuth Extensions

When a service supports **OAuth 2.0 sign-in** (PagerDuty, GitHub, Google
Workspace, many internal identity providers), your extension can let the user
connect through the provider's own consent page instead of pasting keys. The
bundled **PagerDuty** extension is the reference implementation — open its folder
from the Extensions page (folder icon on the card) to read the full source.

NeatContext runs the **entire OAuth flow for you**, driven purely by your
manifest:

- **Connect** opens the system browser to the provider's authorize page
  (Authorization Code + **PKCE**, S256).
- A temporary localhost server catches the redirect, NeatContext exchanges the
  code at the token endpoint, and stores the tokens **encrypted** with the OS
  secure storage.
- Before every tool call, the access token is **refreshed automatically** if it
  has expired (when the provider issued a refresh token) and injected into your
  server over the `neatcontext/connection` handshake.

Your server never sees the flow — it just receives a currently-valid access
token per call.

:::info[Prerequisites]
Read [Build Your First Extension](./building-extensions.md) first — this guide
reuses its folder layout, framing, and dispatch, and only shows what changes for
OAuth.
:::

## 1. Register an OAuth app with the provider

Before writing the manifest you need an OAuth client from the service:

1. Create an OAuth app in the provider's developer settings. Choose a **public
   client** with **Authorization Code + PKCE** — NeatContext is a desktop app and
   stores **no client secret**.
2. Pick a fixed localhost port for your extension (an uncommon one, e.g.
   `48981`) and register the redirect URI **exactly** as:

   ```text
   http://127.0.0.1:<redirectPort>/oauth/<extension id>/callback
   ```

   For an extension with `"id": "acme-tickets"` and `"redirectPort": 48981`:
   `http://127.0.0.1:48981/oauth/acme-tickets/callback`. NeatContext derives this
   URI from your manifest — if the registered URI differs, the provider will
   reject the flow.
3. Note the **client id**, the **authorize URL**, the **token URL**, and the
   **scopes** you need. Request the narrowest (read-only) scopes that work.

:::tip[Refresh tokens]
If the provider makes refresh tokens optional (an "offline access" scope or app
setting), enable them. Without a refresh token, the user must reconnect whenever
the access token expires — NeatContext will say so in the extension's status.
:::

## 2. Declare the connection in the manifest

```json
{
  "id": "acme-tickets",
  "name": "Acme Tickets",
  "version": "0.1.0",
  "description": "Read-only ticket lookup over your Acme Tickets account.",
  "publisher": "Your Name",
  "connection": {
    "kind": "oauth2_pkce",
    "label": "Acme Tickets (read)",
    "authorizeUrl": "https://identity.acme.com/oauth/authorize",
    "tokenUrl": "https://identity.acme.com/oauth/token",
    "clientId": "your-oauth-client-id",
    "scopes": ["read"],
    "redirectPort": 48981,
    "config": { "apiBaseUrl": "https://api.acme.com" }
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

- **`authorizeUrl` / `tokenUrl` / `clientId` / `scopes` / `redirectPort`** fully
  describe the flow; there is no OAuth code in your extension.
- **`config`** is static, non-secret configuration passed through to your server
  (here, the API base URL) so the server stays free of hardcoded endpoints.
- **`requiresConnection: true`** makes NeatContext inject the token before each
  tool call.

## 3. What the user experiences

The extension card shows **Not connected** with a single **Connect** button — no
form, since there is nothing to type:

- **Connect** opens the browser; after the user approves, a "connected — you can
  close this window" page appears and the card flips to **Connected**.
- If the browser is never completed, the attempt times out after a few minutes.
- Token refresh is invisible; the card only asks the user to reconnect when
  recovery isn't possible (refresh token missing/revoked, or the stored token
  can't be decrypted on this machine).
- **Disconnect** deletes the stored tokens.

## 4. Receive the token in your server

After `initialize`, and only when connected, your server gets:

```json
{
  "jsonrpc": "2.0",
  "method": "neatcontext/connection",
  "params": {
    "extensionId": "acme-tickets",
    "connection": {
      "kind": "oauth2_pkce",
      "values": { "accessToken": "…current access token…" },
      "config": {
        "apiBaseUrl": "https://api.acme.com",
        "scope": "read",
        "diagnosticLogPath": "…\\logs\\acme-tickets-tool.log"
      }
    }
  }
}
```

`values.accessToken` is refreshed by NeatContext right before injection, so treat
it as valid *now* — don't cache it, don't persist it. `config` merges your
manifest `config` with the granted `scope` and a `diagnosticLogPath` you may
append troubleshooting logs to (redact tokens).

```js
let connection = null;

if (request.method === "neatcontext/connection") {
  const incoming = request.params && request.params.connection;
  const values = (incoming && incoming.values) || {};
  const config = (incoming && incoming.config) || {};
  connection = incoming
    ? {
        accessToken: values.accessToken,
        apiBaseUrl: config.apiBaseUrl || "https://api.acme.com",
        diagnosticLogPath: config.diagnosticLogPath
      }
    : null;
  return;
}
```

## 5. Use the token — and handle the missing/rejected cases

```js
async function getTicket(args) {
  const ticketId = String(args.ticket || "").trim();
  if (!ticketId) throw new Error('Tool argument "ticket" is required.');

  // Not connected: no handshake arrived. NeatContext stops the tool loop,
  // answers with your message, and shows a "Connect Acme Tickets" button.
  if (!connection || !connection.accessToken) {
    return {
      error: "acme_tickets_not_connected",
      connection_required: true,
      provider: "acme-tickets",
      message: "Connect Acme Tickets before reading tickets."
    };
  }

  const response = await fetch(
    `${connection.apiBaseUrl}/tickets/${encodeURIComponent(ticketId)}`,
    { headers: { Authorization: `Bearer ${connection.accessToken}` } }
  );

  // 401 after an automatic refresh means the grant itself is gone —
  // ask the user to reconnect.
  if (response.status === 401) {
    return {
      error: "acme_tickets_not_connected",
      connection_required: true,
      provider: "acme-tickets",
      message: "Acme Tickets access expired. Reconnect Acme Tickets."
    };
  }

  // 403: connected, but the granted scopes don't cover this request.
  // Terminal, but phrased as a permissions problem.
  if (response.status === 403) {
    return {
      error: "acme_tickets_access_denied",
      provider: "acme-tickets",
      message:
        "Acme Tickets is connected, but the granted scope cannot read this ticket. " +
        "Check the OAuth app's scopes and the account's access."
    };
  }

  // Other failures: plain error result (no connection_required) so the
  // model can react and retry within the conversation.
  if (!response.ok) {
    return {
      error: "acme_tickets_error",
      provider: "acme-tickets",
      message: `Ticket fetch failed with status ${response.status}.`
    };
  }

  return await response.json();
}
```

## 6. Test it

1. **Extensions → Add extension**, select the folder, **Enable** it.
2. Ask the model something that needs the tool *before connecting* → your
   not-connected message plus a **Connect Acme Tickets** button should appear in
   the chat.
3. Click **Connect** → browser opens → approve → the card shows **Connected**.
4. Ask again → the tool runs with a live token.
5. Revoke the app's access on the provider side and ask again → the reconnect
   message should come back.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Provider error page ("redirect_uri mismatch") | The registered redirect URI doesn't exactly match `http://127.0.0.1:<redirectPort>/oauth/<id>/callback`. |
| Connect fails immediately with a port error | Another process is using `redirectPort` — pick a different fixed port and update both the manifest and the OAuth app. |
| Card says access expired and asks to reconnect | The provider issued no refresh token; enable offline/refresh access on the OAuth app if it supports it. |
| Browser flow completes but the card stays disconnected | Token endpoint rejected the exchange — recheck `tokenUrl` and `clientId`, and that the app is a public PKCE client (no secret required). |

## Next

- **[API-Key Extensions](./api-key-extensions.md)** — for services without OAuth.
- **[Manifest Reference](./manifest-reference.md)** — the full connection schema
  and terminal-result contract.
