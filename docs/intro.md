---
sidebar_position: 1
---

# Introduction

Welcome to the **NeatContext** documentation.

NeatContext is a **local-first desktop application** for building the context you
feed to LLM-based tools. Your domain profiles, knowledge folders, model
configuration, and tool connections live on your own machine. NeatContext does not
host a model of its own — it **orchestrates the model you bring** (an
OpenAI-compatible or Anthropic-compatible endpoint, or a local model), grounding it
in the knowledge and tools you give it.

## Why NeatContext

A general-purpose LLM answers from general knowledge. That is rarely enough for
real operational work, where the *right* answer depends on **your team's context**:
what you own, which runbooks apply, and which actions are dangerous in your
environment.

NeatContext lets you assemble that context deliberately, from four building blocks:

- **Domain profiles** — a Markdown description of a team or domain: what it owns,
  how it investigates, and its guardrails.
- **Knowledge bases** — local folders of Markdown (runbooks, TSGs, postmortems)
  the model searches for grounded, citable answers.
- **Extensions** — connectors that give the model read/write tools for your real
  systems, over the Model Context Protocol (MCP).
- **Your model** — any tool-calling-capable LLM you configure.

The payoff is concrete: give two different teams their own profile and knowledge
for the **same** incident, and each correctly arrives at its **own** right action.
The [Incident Analysis walkthrough](./guides/incident-analysis.md) demonstrates
exactly this.

## Where to go next

- **[Getting Started](./getting-started.md)** — install NeatContext, connect your
  model, and build your first workspace.
- **[Core Concepts](./core-concepts.md)** — how profiles, knowledge, extensions,
  and models fit together.
- **[Incident Analysis walkthrough](./guides/incident-analysis.md)** — a full,
  hands-on demonstration of the advantage.
- **[Building Extensions](./extensions/overview.md)** — write your own connector.

:::note
This documentation is actively growing. If something is missing or unclear,
corrections are welcome.
:::
