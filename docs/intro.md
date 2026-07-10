---
sidebar_position: 1
slug: /
---

# Introduction

Welcome to the **NeatContext** documentation.

NeatContext is a **local-first desktop application** for building the context you
feed to LLM-based tools. Your domain profiles, knowledge folders, model
configuration, and tool connections live on your own machine. NeatContext does not
host a model of its own — it **orchestrates the model you bring** (any
OpenAI-compatible endpoint, cloud or local), grounding it in the knowledge and
tools you give it.

![A NeatContext investigation: tool calls, a grounded answer, clickable sources](/img/demo/06-payments-answer.png)

## Why NeatContext

A general-purpose LLM answers from general knowledge. That is rarely enough for
real operational work, where the *right* answer depends on **your team's context**:
what you own, which runbooks apply, and which actions are dangerous in your
environment.

NeatContext lets you assemble that context deliberately, from four building blocks:

- **[Domain profiles](./features/domain-profiles.md)** — a Markdown description of
  a team or domain: what it owns, how it investigates, and its guardrails.
- **[Knowledge bases](./features/knowledge-bases.md)** — local folders of runbooks,
  TSGs, and postmortems the model searches for grounded, citable answers.
- **[Extensions](./features/using-extensions.md)** — connectors that give the model
  tools for your real systems, over the Model Context Protocol (MCP).
- **[Your model](./features/model-provider.md)** — any tool-calling-capable LLM
  you configure.

Each **chat tab** carries its own profile and knowledge, so different teams'
contexts live side by side. The payoff is concrete: give two teams their own tab
for the **same** incident, and each correctly arrives at its **own** right
action — one hands off, the other fixes the root cause. The
[Incident Analysis walkthrough](./guides/incident-analysis.md) demonstrates
exactly this.

## Where to go next

- **[Getting Started](./getting-started.md)** — from install to your first
  grounded answer in ten minutes.
- **[Core Concepts](./core-concepts.md)** — how profiles, knowledge, extensions,
  and models fit together.
- **[Features](/category/features)** — every feature in depth: chats & tabs,
  profiles, knowledge, model setup, extensions, plans, privacy.
- **[Incident Analysis walkthrough](./guides/incident-analysis.md)** — a full,
  hands-on demonstration of the advantage.
- **[Building Extensions](./extensions/overview.md)** — write your own connector.

:::note
This documentation is actively growing. If something is missing or unclear,
corrections are welcome.
:::
