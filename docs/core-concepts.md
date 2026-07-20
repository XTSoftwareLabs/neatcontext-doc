---
sidebar_position: 3
---

# Core Concepts

NeatContext organizes the context an AI client uses, scopes it **per Context
workspace**, and hands it off over a local MCP connection — **without running a
model of its own**. This page explains each piece and how they combine. (Each has
a full [feature page](/category/features) as well.)

## NeatContext runs no model

This is the idea everything else follows from. NeatContext does **not** host a
chat, does **not** call a model, and does **not** store a model API key. It is a
**control center**: you curate context in it, and your existing AI client — Claude
Code, Claude Desktop, Codex CLI, or ChatGPT Desktop — does the reading,
searching, tool-calling, and answer-writing with its own model.

When you connect a client, NeatContext exposes a small, read-only local MCP
server. The client calls **`get_context`** and receives **pointers, not content**:

- the **domain profile file paths** to read,
- the **knowledge folder paths** to search, and
- the **extension tools** available on this connection.

The client then reads those files, searches those folders, and calls those tools
itself. NeatContext never uploads your corpus and never sees the client's model.

## The Library holds reusable resources

The **[Library](./features/library.md)** is your local registry of reusable
resources:

- **Domain profiles** — Markdown files you create in-app or **link in place**
  from disk.
- **Knowledge folders** — local folders you link in place.
- **Extensions** — read-only tool connectors (bundled, personally added, or from
  a shared team Library).

A Library resource can be selected by many Contexts. Removing it from a Context
never deletes it from the Library or from disk. An optional **read-only Team
Library** — any folder following the `profiles/` + `knowledge/` + `extensions/`
convention (typically a git clone) — lets a team share approved resources.

## The Context is the unit of handoff

A **[Context](./features/contexts.md)** is a named workspace for one operational
scope, shown as a **tab**. Each Context selects its own:

1. **domain profiles** (one of them **active**),
2. **knowledge folders**, and
3. enabled **extensions**.

Because context is per-Context, you never swap things in and out: keep *Team A's*
profile and runbooks in one Context tab and *Team B's* in another, and connect a
client to whichever you need. Every AI-client session is pinned to exactly one
Context.

## Domain profiles

A **domain profile** is a Markdown file describing a team or domain: what it
owns, how it investigates, and the actions it must not take. The connected client
reads the active profile completely and treats it as its primary behavioral guide.

Profiles use YAML front matter for metadata, followed by free-form Markdown:

```markdown
---
id: infra-team
name: Infra Team
type: team
owner: Infra Team
criticality: tier-0
---

# Infra Team

## Purpose
Infra Team owns the shared infrastructure that product teams build on…

## First Checks During Incident
1. Read the incident and its timeline.
2. Look for a recent infra change (pool sizing, mesh config).

## Dangerous Actions (do NOT do without approval)
- Do not fail over the billing-postgres primary during business hours.
```

Good profiles are explicit about three things: **what the team owns**, its
**first checks / investigation order**, and its **guardrails** (dangerous
actions). Those sections are what turn a generic model into a team-specific one.

Profiles are plain Markdown you own and version however you like.
→ Full details: [Domain Profiles](./features/domain-profiles.md)

## Knowledge bases

A **knowledge base** is a local folder of documents — typically a team's
**runbooks**, **troubleshooting guides (TSGs)**, and **postmortems**. The
connected AI client searches the attached folders — in place, locally on your
machine — to ground its answer, and cites the documents it used as **clickable
`file://` sources** at the end of the answer.

Because a knowledge base is just a folder on disk, you keep it in whatever repo
you already use.
→ Full details: [Knowledge Bases](./features/knowledge-bases.md)

## Extensions

An **extension** is a read-only connector that gives your AI **tools** for your
real systems — read an incident, search logs, list deployments. Each one is a
local stdio MCP server; when a client is connected, NeatContext advertises the
selected extension's tools on the same connection and **proxies** each call,
injecting the extension's credentials from your OS keychain so the client never
sees a secret.

Extensions declare how they authenticate, which determines the Connect
experience: nothing to configure, an inline **API-key form** (the bundled
Datadog), or **OAuth in your browser** (the bundled PagerDuty). Credentials are
encrypted with your OS secure storage and stay on your machine.
→ Using them: [Using Extensions](./features/using-extensions.md) ·
Building them: [Building Extensions](./extensions/overview.md)

## AI clients

You connect one of the supported clients — **Claude Code**, **Claude Desktop**,
**Codex CLI**, or **ChatGPT Desktop** — from the Context page. NeatContext opens
a **fresh, Context-pinned session** with an invocation-scoped or project-scoped
MCP configuration; it never rewrites your global client config. The client brings
its own model.
→ Full details: [Connecting AI Clients](./features/connect-ai-clients.md)

## How it all fits together

```text
        ┌───────────────────── One Context workspace ──────────────────────┐
        │                                                                  │
        │   Active profile   +   Knowledge folders   +   Extensions        │
        │   (how to reason)      (what to cite)          (tools to call)   │
        └──────────────────────────────┬───────────────────────────────────┘
                                        │  Connect (local MCP)
                                        ▼
                 Your AI client — Claude Code / Claude Desktop /
                        Codex CLI / ChatGPT Desktop
                                        │
              get_context → reads files, searches folders, calls tools
                                        ▼
                Grounded, team-specific answer with a ## Sources footer
```

Edits you make to a connected Context are picked up on the client's **next**
`get_context` call — no reconnect needed. Selecting a different Context tab does
**not** retarget an open session; connect again to open a new session for it.

The [Incident Analysis walkthrough](./guides/incident-analysis.md) shows this in
action: the same incident and the same tools in two Contexts, with two different
profiles and knowledge bases, produce two different — and both correct — outcomes.
