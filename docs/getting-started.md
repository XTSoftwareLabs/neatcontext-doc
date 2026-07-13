---
sidebar_position: 2
---

# Getting Started

This guide takes you from a fresh install to your first grounded answer, in about
ten minutes. It follows the same shape as a real workspace: sign in, connect a
model, then give a chat a domain profile, a knowledge base, and (optionally) an
extension.

## Prerequisites

- **The NeatContext desktop app** — installed and able to open (Windows or macOS).
- **Your own LLM access** — an API key for an OpenAI-compatible endpoint, or a
  local model server. NeatContext does **not** host a model; it orchestrates
  yours. Pick a **tool-calling-capable** model if you plan to use extensions.
- **(Optional) Node.js 18+** — only if you plan to run the
  [incident demo](./guides/incident-analysis.md)'s mock systems or
  [develop your own extensions](./extensions/building-extensions.md). Just
  *using* extensions needs no Node install — NeatContext runs them on its own
  bundled runtime.

## Step 1 — Sign in

The first time you open NeatContext you're asked to sign in or create an account
(email + password; a verification code is emailed to you).

Signing in identifies your subscription — your actual work (profiles, knowledge,
chats, API keys) stays on your machine. See [Account](./features/account.md).

## Step 2 — Take stock of the window

![NeatContext after first launch](/img/features/first-launch.png)

Four areas matter:

- **Tab strip (top edge)** — one tab per chat. Each tab carries its own context.
- **Sidebar (left)** — this tab's **Domain Profiles** and **Knowledge Base**.
  Both are empty on a fresh install; filling them is Steps 4 and 5.
- **Top bar** — the model button (not configured yet), **Extensions**, and
  your account.
- **Composer (bottom)** — where you'll type. *Enter* sends, *Shift+Enter* makes
  a new line.

## Step 3 — Connect your model

1. Click the **model button** at the left of the top bar.
2. Fill in the form — for most providers that's three values:

   | Field | Example |
   |---|---|
   | Provider | OpenAI-compatible endpoint |
   | Base URL | `https://api.openai.com/v1` |
   | Model | `gpt-5.4-mini` |
   | API key | `sk-…` |

3. Click **Save**, then **Back**. The top bar now shows your model name.

![The Model Provider settings page](/img/features/model-provider.png)

Your key is encrypted with your OS's secure storage and requests go directly
from your machine to this endpoint — no middleman. Local servers (Ollama, LM
Studio, vLLM…) work through their OpenAI-compatible URLs; see
[Model Provider](./features/model-provider.md) for specifics.

## Step 4 — Add a domain profile

A [domain profile](./features/domain-profiles.md) tells the model how your team
thinks: what it owns, what to check first, what never to touch.

:::note[This step is required]
A chat needs an **active domain profile** before you can send a message — context
is the whole point, so NeatContext won't run without at least a minimal one.
:::

1. In the sidebar under **Domain Profiles**, click **New** (starter template,
   opens the editor) — or **Import** if you already have a profile `.md` file.
2. Fill in at least three sections: **what you own**, **first checks**, and
   **dangerous actions**. Save.
3. Back in the chat, the profile shows *"Active in this chat"* and its name
   appears in the top bar.

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

## Step 5 — Add a knowledge base

Under **Knowledge Base**, click the add-folder button and pick a folder of your
team's docs — runbooks, TSGs, postmortems. NeatContext searches it **in place**
(nothing is copied or uploaded) and cites the documents it uses as clickable
sources under each answer. Details in
[Knowledge Bases](./features/knowledge-bases.md).

![A chat with a profile and knowledge folder attached](/img/features/workspace-context.png)

## Step 6 — Add an extension (optional but recommended)

Extensions give the model tools for your real systems — read an incident, search
logs, list deployments. Open **Extensions** in the top bar:

- The bundled **PagerDuty** and **Datadog** connectors are ready to
  [connect](./features/using-extensions.md#connect-an-extension).
- **Add** installs an extension from a folder; **Create** builds a read-only
  connector for any JSON HTTP API without writing code.

![The Extensions page](/img/features/extensions-page.png)

The [incident demo](./guides/incident-analysis.md) ships a complete extension
plus three mock systems for it to talk to — the fastest way to see tools in
action without touching production.

## Step 7 — Ask your first question

Type a question your profile and knowledge can answer. For an operational
workspace:

```text
Please analyze this incident: <link or ID>.
What should we check first, and what's the safe action?
```

Watch the response: **activity steps** show each tool call as it happens, the
answer **streams** in, and **source chips** underneath link to the exact
documents used. Click a source to verify the answer against your own runbook.

## Where to go next

- **[Core Concepts](./core-concepts.md)** — how the pieces combine, in five
  minutes.
- **[Incident Analysis walkthrough](./guides/incident-analysis.md)** — the
  centerpiece demo: one incident, two teams, two correct answers.
- **[Features](/category/features)** — every feature in depth.
- **[Building Extensions](./extensions/overview.md)** — connect your own
  systems.
