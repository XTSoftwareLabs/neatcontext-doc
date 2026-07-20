---
sidebar_position: 2
---

# Getting Started

This guide takes you from a fresh install to your first grounded answer — asked
in your own AI client — in about ten minutes. The shape of a real setup is:
sign in, add a domain profile and a knowledge folder to your **Library**, select
them into a **Context**, then **connect** the AI client you already use.

## Prerequisites

- **The NeatContext desktop app** — installed and able to open (Windows or macOS).
- **A supported AI client, installed and signed in** — one of Claude Code, Claude
  Desktop, Codex CLI, or ChatGPT Desktop (see
  [Connecting AI Clients](./features/connect-ai-clients.md)). NeatContext brings
  **no model** — your AI client brings its own, so there is no API key to enter in
  NeatContext.
- **(Optional) Node.js 18+** — only if you plan to run the
  [incident demo](./guides/incident-analysis.md)'s mock systems or
  [develop your own extensions](./extensions/building-extensions.md). Just
  *using* the bundled extensions needs no Node install — NeatContext runs them on
  its own bundled runtime.

## Step 1 — Sign in

The first time you open NeatContext you're asked to sign in or create an account
(email + password; a verification code is emailed to you).

Signing in identifies your subscription — your actual work (profiles, knowledge,
Contexts) stays on your machine. See [Account](./features/account.md).

## Step 2 — Take stock of the window

NeatContext opens on the **Contexts** page. The main areas, reachable from the
navigation, are:

- **Contexts** — your context workspaces, one per tab. Each Context selects its
  own profiles, knowledge folders, and extensions, and has a **Connect this
  context** panel with a card per AI client.
- **Library** — your reusable domain profiles, knowledge folders, and extensions.
  This is where you *author and link* resources; Contexts just *select* them.
- **Extensions** — install, connect, and manage read-only tool connectors.
- **Context Activity** — a per-Context log of what connected AI clients did.
- **Account** — your sign-in and subscription.

## Step 3 — Add a domain profile to your Library

A [domain profile](./features/domain-profiles.md) tells your AI how your team
thinks: what it owns, what to check first, what never to touch.

1. Open **Library → Domain profiles**.
2. Click **New** (starter template, opens the editor) — or **Import** to link an
   existing profile `.md` file in place. A linked file **stays where it is**, so
   you can keep profiles in a git repo.
3. Fill in at least three sections: **what you own**, **first checks**, and
   **dangerous actions**. Make sure the front matter parses (`id`, `name`,
   `type`). Save.

No profile yet? Start from this minimal template:

```markdown
---
id: my-team
name: My Team
type: team
owner: My Team
---

# My Team

## What we own
- (services / systems your team is responsible for)

## First checks during an incident
1. (the first thing your team looks at)

## Dangerous actions (do NOT do without approval)
- (irreversible or high-blast-radius actions)

## Response style
- Separate facts from hypotheses, and cite the runbook you relied on.
```

## Step 4 — Add a knowledge folder to your Library

Under **Library → Knowledge folders**, click **Add folder** and pick a folder of
your team's docs — runbooks, TSGs, postmortems. NeatContext references it **in
place** (nothing is copied or uploaded); when you connect an AI client, that
client searches the folder itself and cites the documents it uses. Details in
[Knowledge Bases](./features/knowledge-bases.md).

## Step 5 — Build a Context

Open **Contexts** and select (or rename) a Context tab. A Context is a named
selection of Library resources for one operational scope.

1. Under **Domain profiles**, choose **Add from Library** and pick the profile
   from Step 3. Mark one profile as **active**.
2. Under **Knowledge folders**, add the folder from Step 4.
3. (Optional) Under **Extensions**, enable any read-only connectors this Context
   should offer — see Step 6.

The Context page shows exactly which profiles, folders, and tools this Context
will hand off, and reminds you that everything stays local until you connect.

## Step 6 — Add an extension (optional but recommended)

Extensions give your AI tools for your real systems — read an incident, search
logs, list deployments. Open **Extensions**:

- The bundled **PagerDuty** and **Datadog** connectors are ready to
  [connect](./features/using-extensions.md#connect-an-extension).
- **Add** installs an extension from a folder; **Create** builds a read-only
  connector for any JSON HTTP API without writing code.

Enable an extension, then select it into your Context. The
[incident demo](./guides/incident-analysis.md) ships a complete extension plus
three mock systems for it to talk to — the fastest way to see tools in action
without touching production.

## Step 7 — Connect your AI client

1. On the Context page, find the **Connect this context** panel.
2. Click **Connect** on the card for the client you use (Claude Code, Claude
   Desktop, Codex CLI, or ChatGPT Desktop).
3. A new session of that client opens. If it asks, **trust** the folder it opens
   and **approve** the `neatcontext` tools.

There is no model to configure — the client brings its own. See
[Connecting AI Clients](./features/connect-ai-clients.md) for what each client
does on Connect.

## Step 8 — Ask your first question, in your AI client

In the session that just opened, ask a question your profile and knowledge can
answer. For an operational Context:

```text
Please analyze this incident: <link or ID>.
What should we check first, and what's the safe action?
```

Your AI client answers using the Context you built, and ends with a **Sources**
list of the files and tools it used. Click a source to check the answer against
your own runbook.

Back in NeatContext, open **Context Activity** for this Context to see what was
served and which tools ran.

## Where to go next

- **[Core Concepts](./core-concepts.md)** — how the pieces combine, in five
  minutes.
- **[Connecting AI Clients](./features/connect-ai-clients.md)** — what each
  supported client does on Connect.
- **[Incident Analysis walkthrough](./guides/incident-analysis.md)** — the
  centerpiece demo: one incident, two Contexts, two correct answers.
- **[Building Extensions](./extensions/overview.md)** — connect your own systems.
