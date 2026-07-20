---
sidebar_position: 7
---

# Context Activity

Because NeatContext runs no chat of its own, the way you see **what actually
happened** with a Context is its **activity log**. Each Context keeps its own log
of what connected AI clients did with it: sessions opened, context handed off, and
extension tools invoked.

Open it from a Context's **View activity** action, or from the **Context Activity**
page (which lists every Context; selecting one there only *views* its log and never
changes the app's active Context).

## What's recorded

- **Sessions opened** — when a client connected to this Context.
- **Context handoffs** — when this Context was handed to the client.
- **Tool calls** — each extension tool the client used, with timing and a short
  preview. Full tool payloads aren't stored, and credentials are hidden.

This is how you verify a Context: connect a client, ask a question, then read the
log to confirm which profiles, folders, and tools were actually served and run.

## Retention

Logs are stored locally as JSONL files with **bounded retention** — age- and
size-limited, oldest events dropped first. The defaults are **30 days** and
**32 MiB** per Context. You can change both from the page (7 days to forever;
8 / 32 / 128 MiB), and the new policy is applied to disk immediately.

- **Clear log** empties the current Context's log (two-step confirmation).
- **Open logs folder** reveals the raw JSONL files so they stay inspectable.

Everything stays on your machine — activity logs are never sent to a NeatContext
server.
