---
sidebar_position: 2
---

# Domain Profiles

A **domain profile** is a Markdown file that tells the model how *your* team (or
service, or domain) thinks: what it owns, what it checks first, and what it must
never do. The **active** profile of a chat tab is injected into every request as
steering context — it is the single highest-leverage piece of context you can add.

## Create or import a profile

The **Domain Profiles** section in the sidebar has two buttons:

- **New** — creates a fresh profile with a starter template (*Purpose*,
  *First Checks*, *Dangerous Actions*) and opens it in the editor. The file is
  stored in NeatContext's own data folder.
- **Import** — picks an existing `.md` / `.markdown` file from disk. The file
  **stays where it is** — NeatContext references it in place, so you can keep
  profiles in a git repo and share them with your team. Edits you make in
  NeatContext's editor are saved back to that same file.

Either way, the profile attaches to the **current chat tab** and appears in the
sidebar list.

:::tip[Profiles are per-tab]
Importing a profile attaches it to the tab you're on. Other tabs are untouched —
that's what lets one tab be "Payments" and another "Infra". The **✕** next to a
profile detaches it from the current tab only; the file on disk is unaffected.
:::

## Make it active

A tab can have several profiles attached, but exactly **one is active** — the one
marked *"Active in this chat"* and shown in the top bar. Click a profile in the
sidebar to make it the active one. The active profile is what steers the model;
the others are just attached and ready to switch to.

## Edit a profile

Double-click a profile (or click its **pencil** icon) to open the editor:

![The domain profile editor: metadata on top, raw Markdown below](/img/features/profile-editor.png)

- **Name** and **Markdown file path** at the top.
- The **raw Markdown** below — what you see is exactly what the model gets.
- **Save** writes to the profile's file; **Duplicate** copies it as a starting
  point for a similar team; **Delete** removes it (with confirmation).

## Anatomy of a good profile

Profiles start with optional **YAML front matter** for metadata, then free-form
Markdown:

```markdown
---
id: payments-team
name: Payments Engineering
type: team
owner: Payments Engineering
criticality: tier-0
---

# Payments Engineering

## Purpose
Payments Engineering owns the customer-facing payment path: `checkout-api`,
`billing-api`, `invoice-worker`, and the webhook processor.

## Services We Own
- checkout-api
- billing-api
- invoice-worker

## First Checks During an Incident
1. Read the incident and its timeline.
2. Did *we* deploy near the start time? Check recent deployments.
3. Is the payment provider healthy?

## Dangerous Actions (do NOT do without approval)
- Do not restart invoice-worker during the 09:00–10:00Z settlement window.
- Do not touch pgbouncer or Postgres — that is Infra Team's surface; escalate.

## Response Style
- Separate confirmed facts from hypotheses.
- Cite the runbook you relied on.
```

The `owner` and `criticality` fields are shown in the top bar next to the active
profile. Beyond that, the structure is yours — but the profiles that work best are
explicit about three things:

1. **Ownership** — what is (and is not) this team's. This is what lets the model
   correctly say *"not ours — hand off"* instead of guessing at a fix.
2. **Investigation order** — the team's first checks, in order. The model will
   actually follow them.
3. **Guardrails** — dangerous actions, stated as prohibitions. The model repeats
   these as warnings at exactly the right moments.

The [incident demo's two profiles](https://github.com/XTSoftwareLabs/neatcontext-demo/tree/main/profiles)
are complete, realistic examples worth copying.

## Where profiles live

Profiles created with **New** are stored by NeatContext for you; imported
profiles remain at their original path (shown in the editor). Either kind is a
plain Markdown file you can open, diff, and version like any other text file —
there is no lock-in format.
