---
sidebar_position: 3
---

# Core Concepts

NeatContext assembles the context an LLM uses from four building blocks. This page
explains each one and how they combine into a **workspace**.

## The workspace

A workspace is the active combination of:

1. an **active domain profile**,
2. one or more **knowledge bases**,
3. any enabled **extensions**, and
4. your configured **model**.

When you ask a question, NeatContext gives the model the active profile as steering
context, lets it search the knowledge bases for grounded evidence, and exposes the
enabled extensions' tools so it can query your real systems. Change the profile or
knowledge base and you change how the model reasons — without touching the tools or
the underlying data.

## Domain profiles

A **domain profile** is a Markdown file describing a team or domain: what it owns,
how it investigates, and the actions it must not take. The active profile steers
the model toward *that* team's correct behavior.

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
…

## Dangerous Actions (do NOT do without approval)
- Do not fail over the billing-postgres primary during business hours.
…
```

Good profiles are explicit about three things: **what the team owns**, its
**first checks / investigation order**, and its **guardrails** (dangerous actions).
Those sections are what turn a generic model into a team-specific one.

Profiles are plain Markdown you own and version however you like. You import them
into NeatContext and mark one as **active**.

## Knowledge bases

A **knowledge base** is a local folder of Markdown documents — typically a team's
**runbooks**, **troubleshooting guides (TSGs)**, and **postmortems**. NeatContext
searches these to ground the model's answers in your material, so responses cite
*your* documents rather than general web knowledge.

Because a knowledge base is just a folder on disk, you keep it in whatever repo or
directory you already use. You add and remove knowledge folders per workspace; the
model only searches what is currently added.

:::tip
Common non-content directories (e.g. `node_modules/`, `.git/`, build outputs) are
skipped automatically when a folder is searched.
:::

## Extensions

An **extension** is a connector that gives the model **tools** for your real
systems — read an incident, search logs, list deployments, and so on. Extensions
speak the **Model Context Protocol (MCP)**: each is a small server that advertises a
set of tools and executes them when the model calls.

Extensions can declare a **connection** requirement, which determines how you
connect them on the Extensions page:

- `none` — no authentication (local systems, or endpoints the extension reaches
  itself). Nothing to configure; enable it and go.
- `api_key` / `bearer` — you paste credentials into an inline form on the
  extension's card (the bundled **Datadog** extension works this way). Secrets are
  encrypted with your OS secure storage and handed to the extension only when its
  tools run.
- `oauth2_pkce` — **Connect** opens your browser to sign in with the service (the
  bundled **PagerDuty** extension works this way); tokens are stored encrypted and
  refreshed automatically.

See [Building Extensions](./extensions/overview.md) for the full model, including
the manifest, the protocol, and step-by-step guides for each connection type.

## Your model

NeatContext does **not** provide hosted inference. You configure your own provider
in model settings — an OpenAI-compatible or Anthropic-compatible endpoint, or a
local model — with its base URL, API key, and model name.

To use extension tools, the active model must be **tool-calling capable**;
otherwise the model can still use profiles and knowledge, but cannot query your
systems through extensions.

## How it all fits together

```text
        ┌───────────────────────── Workspace ─────────────────────────┐
        │                                                              │
Question │  Active profile   +   Knowledge bases   +   Extensions      │
   ──────►  (how to reason)      (what to cite)        (tools to call) │
        │              \             |              /                  │
        │               ▼            ▼             ▼                   │
        │                    Your configured model                    │
        │                            │                                │
        └────────────────────────────┼────────────────────────────────┘
                                     ▼
                        Grounded, team-specific answer
```

The [Incident Analysis walkthrough](./guides/incident-analysis.md) shows this in
action: the same incident and the same tools, but two different profiles and
knowledge bases, produce two different — and both correct — outcomes.
