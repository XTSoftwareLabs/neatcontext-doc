---
sidebar_position: 5
---

# Connecting AI Clients

NeatContext does **not** host or resell a model, and it never asks for a model API
key. Your answers come from the AI client you already use. NeatContext's job is to
hand that client the right context — over a local MCP (Model Context Protocol)
connection — and then get out of the way while the client reads, searches, calls
tools, and writes the answer with **its own** model.

## Supported clients

| Client | How it connects |
|---|---|
| **Claude Code** (CLI) | A fresh `claude` session, MCP passed for that invocation only. |
| **Claude Desktop** | A new session in Claude Desktop's built-in **Claude Code**. |
| **Codex CLI** | A fresh Codex TUI session, MCP passed for that invocation only. |
| **ChatGPT Desktop** | A new chat in ChatGPT Desktop's built-in **Codex**. |

Each card on a Context's **Connect this context** panel shows a readiness hint —
*Ready to connect*, *…not found* (client not installed), or *Build required* (the
native backend still needs building, only in a source build).

![The Connect this context panel on the Context page, with a Connect button on each of the ChatGPT Desktop, Claude Desktop, Codex CLI, and Claude Code CLI cards](/img/features/contexts-page.png)

## How to connect

1. Open **Contexts** and select the Context tab you want to hand off.
2. Attach its domain profiles (mark one active), knowledge folders, and any
   trusted read-only extensions.
3. In **Connect this context**, click **Connect** on the client you use.
4. If the client prompts you, **trust** the NeatContext-managed workspace and
   **approve** the `neatcontext` MCP tools.
5. Ask your question in the session that opens.

Every **Connect** opens a **fresh** session — NeatContext does not resume or scan
your past conversations. It never rewrites your global client configuration:
CLI clients get MCP only for that one invocation, and desktop clients get a
project-scoped config inside a NeatContext-managed workspace.

## What the client receives

Once connected, the client can call one read-only tool plus one tool per selected
extension tool:

- **`get_context`** returns the connected Context as **pointers, not content**:
  the domain profile file paths to read, the knowledge folder paths to search, and
  the extension tools available on this connection — with the instruction to use
  them itself.
- **One tool per selected extension tool** (for example `demo_search_logs`),
  proxied to that extension's local MCP server with your connection injected from
  the OS keychain. The client calls live systems directly but **never sees a
  secret**.

During the MCP `initialize` handshake, NeatContext also supplies its analysis and
output instructions, so the client grounds claims in what it actually read, labels
hypotheses, and ends the answer with a **`## Sources`** section citing the exact
files (as `file://` links with line ranges) and tools it used.

## Context pinning and live edits

- **Pinned to one Context.** Sessions launched for the same Context share its
  runtime; different Contexts use different runtime and workspace paths, so a later
  connection never retargets an earlier session.
- **Live edits.** The MCP server (and, for the desktop clients, a prompt hook)
  reread the Context's runtime file, so adding or removing profiles, folders, or
  extensions in NeatContext is visible on the client's **next** `get_context`
  without reconnecting.
- **Deleted or disconnected Context.** If a Context's runtime is removed, the
  client gets an actionable *connect from NeatContext first* message instead of
  answering from stale context.

## The runtime boundary

The Context runtime file NeatContext writes for a connection contains **only
nonsecret metadata**: profile paths, knowledge-folder paths, allowed extension
commands and tool schemas, and keychain *references*. Extension secrets stay in
your OS keychain and are injected only into the extension process, per call — never
written into a runtime file or exposed to the client.

## Per-client notes

### Claude Code

A fresh `claude` interactive session in a stable per-Context managed workspace
containing only a `UserPromptSubmit` hook; the MCP server is passed via
`--mcp-config` for that invocation. Use `/mcp` inside Claude Code to inspect the
connection and its tools.

### Claude Desktop

Opens a new session in Claude Desktop's built-in **Claude Code** surface (not a
plain Claude chat) through a `claude://code/new?folder=…` link. Confirm the folder
and approve the tools when prompted.

### Codex CLI

A fresh Codex TUI session started with `-C` in a stable per-Context workspace; the
MCP server is supplied through invocation-scoped `-c` overrides. NeatContext never
edits your `~/.codex/config.toml`. Codex applies its normal project-hook trust
review.

### ChatGPT Desktop

Opens a new chat in ChatGPT Desktop's built-in **Codex** host (not a hosted plain
ChatGPT chat) through a `codex://threads/new?path=…` link. Review and trust the
managed workspace, hook, and MCP tools when prompted.

:::note[No model configuration, ever]
There is no model provider, base URL, or API key anywhere in NeatContext. If you
expected a "connect your model" step from an older version, it has been removed —
the connected AI client brings the model.
:::
