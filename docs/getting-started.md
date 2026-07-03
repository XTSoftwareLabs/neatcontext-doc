---
sidebar_position: 2
---

# Getting Started

This guide takes you from a fresh install to your first grounded answer. It follows
the same shape as a real workspace: connect a model, add an extension, then add a
domain profile and a knowledge base.

## Prerequisites

- **The NeatContext desktop app** — installed and able to open.
- **Your own LLM provider** — an OpenAI-compatible or Anthropic-compatible API
  key/endpoint, or a local model. NeatContext does **not** host a model; it
  orchestrates yours. A **tool-calling-capable** model is required to use extension
  tools.
- **(Optional) Node.js 18+** — only if you plan to run local extensions or the
  [incident demo](./guides/incident-analysis.md).

## Step 1 — Configure your model

1. Launch NeatContext.
2. Open **model settings** and add your provider: **base URL**, **API key**, and
   **model name**.
3. Choose a **tool-calling-capable** model and make it the **active** model. Your
   active model is shown in the top bar.

:::info
No inference happens on NeatContext's servers — requests go directly from the app
to the provider you configured.
:::

## Step 2 — Add an extension (optional but recommended)

Extensions give the model tools for your real systems. To add one:

1. Go to the **Extensions** page.
2. Click **Add extension** and select the extension's folder — the one containing
   its `neatcontext-extension.json` manifest. NeatContext copies it into its own
   `userData/extensions/` and loads it.
3. **Enable** the extension. If it declares `connection: none`, there is nothing to
   authenticate. If it requires a connection, complete the connection step so its
   tools become available.

Once enabled, the extension's tools are offered to the model during chat. You can
try a ready-made connector by following the
[Incident Analysis walkthrough](./guides/incident-analysis.md), or write your own
with the [extension guide](./extensions/overview.md).

## Step 3 — Add a domain profile

A [domain profile](./core-concepts.md#domain-profiles) steers the model toward your
team's correct behavior.

1. In the **Domain Profiles** panel, click **Import local Markdown profile** and
   choose your profile `.md` file.
2. Mark it **active**.

If you don't have a profile yet, start from this minimal template and save it as
`my-team.md`:

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
2. …

## Dangerous actions (do NOT do without approval)
- (irreversible or high-blast-radius actions to avoid)

## Response style
- Separate facts from hypotheses, and cite the runbook you relied on.
```

## Step 4 — Add a knowledge base

Add a folder of your team's Markdown docs (runbooks, TSGs, postmortems) as a
**local knowledge folder**. NeatContext searches it to ground answers in your
material. You can add more than one folder, and remove folders you don't want the
model to search.

## Step 5 — Ask your first question

Open a new chat and ask something your profile and knowledge base can answer. For an
operational workspace, that might be:

```
Please analyze this incident: <link or ID>.
What should we check first, and what's the safe action?
```

With a tool-calling model and an enabled extension, the model will **call tools** to
gather first-hand evidence, **search your knowledge base**, and answer within your
profile's guardrails — citing the documents it used.

## Next steps

- **[Core Concepts](./core-concepts.md)** — understand how the pieces combine.
- **[Incident Analysis walkthrough](./guides/incident-analysis.md)** — see the
  advantage end-to-end with a downloadable demo.
- **[Building Extensions](./extensions/overview.md)** — connect your own systems.
