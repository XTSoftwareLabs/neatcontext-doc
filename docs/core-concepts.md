---
sidebar_position: 3
---

# Core Concepts

NeatContext assembles the context an LLM uses from four building blocks, and
scopes that context **per chat tab**. This page explains each piece and how they
combine. (Each has a full [feature page](/category/features) as well.)

## The chat tab is the unit of context

Every chat lives in its own **tab**, and each tab carries its own:

1. attached **domain profiles** (one of them **active**),
2. attached **knowledge folders**,

while sharing the workspace-wide pieces:

3. enabled **extensions**, and
4. your configured **model**.

When you ask a question, NeatContext gives the model the tab's active profile as
steering context, searches the tab's knowledge folders for grounded evidence, and
offers the enabled extensions' tools so the model can query your real systems.

Because context is per-tab, changing it never means swapping things in and out:
keep *Team A's* profile and runbooks in one tab and *Team B's* in another, and
flip between them. Same tools, same data, different reasoning.

![Two tabs, each with its own team context](/img/features/chat-tabs.png)

## Domain profiles

A **domain profile** is a Markdown file describing a team or domain: what it
owns, how it investigates, and the actions it must not take. The active profile
steers the model toward *that* team's correct behavior.

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
**runbooks**, **troubleshooting guides (TSGs)**, and **postmortems**. NeatContext
searches attached folders (in place, locally, keyword-based — no cloud index) to
ground answers in your material, and cites the documents it used as **clickable
sources** under the answer.

Because a knowledge base is just a folder on disk, you keep it in whatever repo
you already use. Non-content directories (`.git`, `node_modules`, build outputs)
are skipped automatically.
→ Full details: [Knowledge Bases](./features/knowledge-bases.md)

## Extensions

An **extension** is a connector that gives the model **tools** for your real
systems — read an incident, search logs, list deployments. Extensions speak the
**Model Context Protocol (MCP)**: each is a small local server that advertises
tools and executes them when the model calls.

Extensions declare how they authenticate, which determines the Connect
experience: `none` (enable and go), an inline **API-key form** (the bundled
Datadog), or **OAuth in your browser** (the bundled PagerDuty). Credentials are
encrypted with your OS secure storage and injected only when tools run.
→ Using them: [Using Extensions](./features/using-extensions.md) ·
Building them: [Building Extensions](./extensions/overview.md)

## Your model

NeatContext does **not** provide hosted inference. You configure your own
OpenAI-compatible endpoint (cloud or local) with a base URL, model name, and API
key; requests go directly from your machine to it. To use extension tools, the
model must be **tool-calling capable**.
→ Full details: [Model Provider](./features/model-provider.md)

## How it all fits together

```text
        ┌────────────────────────── Chat tab ──────────────────────────┐
        │                                                              │
Question │  Active profile   +   Knowledge folders  +   Extensions     │
   ──────►  (how to reason)      (what to cite)        (tools to call) │
        │              \             |              /                  │
        │               ▼            ▼             ▼                   │
        │                    Your configured model                     │
        │                            │                                 │
        └────────────────────────────┼─────────────────────────────────┘
                                     ▼
                     Grounded, team-specific, cited answer
```

The [Incident Analysis walkthrough](./guides/incident-analysis.md) shows this in
action: the same incident and the same tools in two tabs, with two different
profiles and knowledge bases, produce two different — and both correct —
outcomes.
