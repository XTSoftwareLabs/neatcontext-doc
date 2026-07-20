---
sidebar_position: 1
slug: /
---

# Introduction

Welcome to the **NeatContext** documentation.

:::tip[Quick hands-on demo]
Don't want to read the docs first? Clone the demo repo and try NeatContext right
away: **[github.com/XTSoftwareLabs/neatcontext-demo](https://github.com/XTSoftwareLabs/neatcontext-demo)**.
:::

NeatContext is a **local-first desktop application** that organizes your team's
context and hands it to the AI client you **already work in** — Claude Code,
Claude Desktop, Codex CLI, or ChatGPT Desktop. Your domain profiles, knowledge
folders, and tool connections live on your own machine.

You keep working in your AI client — NeatContext just gives it your team's
context so its answers are grounded in *your* runbooks, systems, and rules. There
is no model to configure and no API key to enter: your AI client brings its own
model.

## Why NeatContext

A general-purpose AI answers from general knowledge. That is rarely enough for
real operational work, where the *right* answer depends on **your team's context**:
what you own, which runbooks apply, and which actions are dangerous in your
environment.

NeatContext lets you assemble that context deliberately, from three building
blocks, and serve it to your AI:

- **[Domain profiles](./features/domain-profiles.md)** — a Markdown description of
  a team or domain: what it owns, how it investigates, and its guardrails.
- **[Knowledge bases](./features/knowledge-bases.md)** — local folders of runbooks,
  TSGs, and postmortems your AI searches for grounded, citable answers.
- **[Extensions](./features/using-extensions.md)** — read-only connectors that give
  your AI tools for your real systems (incidents, logs, deployments).

You group those into a **[Context](./features/contexts.md)** — a named workspace
for one operational scope — then **[connect an AI client](./features/connect-ai-clients.md)**
to it. The payoff is concrete: give two teams their own Context for the **same**
incident, and each correctly arrives at its **own** right action — one hands off,
the other fixes the root cause. The
[Incident Analysis walkthrough](./guides/incident-analysis.md) demonstrates
exactly this.

## What NeatContext is *not*

- It is **not** a chat app — you keep working in your existing AI client.
- It does **not** host or resell a model, and it never asks for a model API key.
- It does **not** send your files or incident data to a NeatContext server.

Your AI client brings its own model; NeatContext brings the private context that
model needs.

## Where to go next

- **[Getting Started](./getting-started.md)** — from install to your first
  grounded answer in your AI client, in about ten minutes.
- **[Core Concepts](./core-concepts.md)** — how Contexts, profiles, knowledge,
  extensions, and AI clients fit together.
- **[Features](/category/features)** — every feature in depth: Contexts, the
  Library, profiles, knowledge, AI-client connections, extensions, and activity.
- **[Incident Analysis walkthrough](./guides/incident-analysis.md)** — a full,
  hands-on demonstration of the advantage.
- **[Building Extensions](./extensions/overview.md)** — write your own connector.

:::note
This documentation is actively growing. If something is missing or unclear,
corrections are welcome.
:::
