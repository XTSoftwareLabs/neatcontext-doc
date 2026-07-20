---
sidebar_position: 3
---

# Core Concepts

NeatContext is a control center for the context your AI uses. You curate that
context here, then connect the AI client you already work in and ask your
questions there. This page introduces the vocabulary you'll see in the app.

## What you work with

- **Domain profile** — a Markdown file describing a team or domain: what it owns,
  how it investigates, and what it must never do.
- **Knowledge base** — a local folder of documents (runbooks, TSGs, postmortems)
  your AI can search and cite.
- **Extension** — a read-only connector that gives your AI tools for a real system
  (incidents, logs, deployments).
- **Library** — where your profiles, knowledge folders, and extensions live so you
  can reuse them.
- **Context** — a named workspace, shown as a tab, that selects the profiles,
  knowledge folders, and extensions for one job.
- **AI client** — the app you already use to talk to a model (Claude Code, Claude
  Desktop, Codex CLI, or ChatGPT Desktop). NeatContext brings no model of its own.

## How the pieces fit

1. **Add resources to your [Library](./features/library.md).** Create or link
   [domain profiles](./features/domain-profiles.md), link
   [knowledge folders](./features/knowledge-bases.md), and install any
   [extensions](./features/using-extensions.md) you need.
2. **Build a [Context](./features/contexts.md).** On a Context tab, select the
   profiles, knowledge folders, and extensions for the job, and mark one profile
   **active**.
3. **[Connect your AI client](./features/connect-ai-clients.md).** Click **Connect**
   and ask your question in the session that opens. The answer ends with a
   **Sources** list of the files and tools it used, so you can verify it.

## The Context is the unit

A **Context** carries its own profiles, knowledge folders, and extensions, so you
never swap things in and out. Keep *Team A's* profile and runbooks in one Context
tab and *Team B's* in another, and connect a client to whichever you need.

That is what makes NeatContext's core advantage possible: give two teams their own
Context for the **same** incident, and each correctly reaches its **own** right
action — one hands off, the other fixes the root cause. The
[Incident Analysis walkthrough](./guides/incident-analysis.md) shows this end to
end.

## Anatomy of a domain profile

A profile is plain Markdown with optional YAML front matter for metadata:

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

The sections that matter most are **what the team owns**, its **first checks**, and
its **guardrails** (dangerous actions). Those turn a generic answer into a
team-specific one. Full guidance is in
[Domain Profiles](./features/domain-profiles.md).
