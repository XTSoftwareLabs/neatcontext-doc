---
sidebar_position: 5
---

# Using Extensions

**Extensions** give the model **tools**: read an incident, search logs, list
deployments, look up a service. Each extension is a small connector that runs
locally as part of NeatContext. This page is about *using* extensions; to write
your own, see [Building Extensions](../extensions/overview.md).

Open the page with the **Extensions** button in the top bar:

![The Extensions page, with the bundled Datadog and PagerDuty connectors](/img/features/extensions-page.png)

## What ships in the box

Two first-party connectors come **bundled** (marked *Built-in*; they can be
disabled but not removed):

- **PagerDuty** — read-only incident tools (incident details, related incidents,
  past incidents), connected with OAuth.
- **Datadog** — read-only log search, connected with your Datadog API keys.

They are also reference implementations: click the **folder icon** on either
card to open its source.

Independent of extensions, a set of **built-in local tools** is always available
to the model: searching the tab's knowledge folders, reading files from them, and
reading your domain profiles. These are read-only and limited to the folders and
profiles you attached.

## Add an extension

1. Click **Add**.
2. Pick the extension's **folder** — the one containing its
   `neatcontext-extension.json` manifest.
3. NeatContext **copies** the folder into its own data directory and loads it.
   The new card appears in the list, enabled.

![A user-installed extension card with its tools listed](/img/features/extensions-with-demo.png)

Each card shows the extension's name, description, version, its **tools** (hover
one for its description), and the controls: **Enable/Disable**, **open folder**,
and — for extensions you added — **remove**.

:::caution Extensions are code you run
An extension runs on your machine with your user's permissions. Treat a
third-party extension like any code you download: review it before adding
(click the folder icon and read the server — good extensions are a single
readable file). Prefer read-only connectors.
:::

## Connect an extension

Extensions that talk to a real service declare how they authenticate, and the
card adapts:

- **No connection** — nothing to configure. Local or unauthenticated systems;
  enable and go.
- **API keys** — the card shows an **inline form** for the keys the extension
  declared. Fill it and click **Connect**:

  ![The Datadog card: an inline API-key form](/img/features/extension-datadog-card.png)

- **OAuth** — the card shows a **Connect** button that opens your **browser** on
  the provider's sign-in page. Approve, and NeatContext catches the redirect and
  stores the tokens (refreshing them automatically from then on):

  ![The PagerDuty card: connect through the provider's sign-in page](/img/features/extension-pagerduty-card.png)

Either way, credentials are **encrypted with your OS secure storage**, stay on
your machine, and are handed to the extension only at the moment a tool runs —
never written into its folder. **Disconnect** deletes the stored credentials.

If you ask a question that needs a not-yet-connected extension, the answer will
say so and offer a **Connect** button right in the chat — you don't have to
remember to set things up in advance.

## Create an extension without writing code

The **Create** button opens a guided builder that generates a working, read-only
connector for any JSON HTTP API — no code required:

![The 4-step extension builder](/img/features/extension-builder.png)

1. **Basics** — name the connector and give the API's base URL.
2. **Auth** — none, an API-key header, or OAuth.
3. **Data** — define the endpoint path (e.g. `/api/services/{serviceName}`) and
   the tool's input.
4. **Review** — check the result, then **Generate extension**.

The generated extension is installed like any other: it appears on the Extensions
page, its folder is openable (and a nice starting point to grow from if you later
want to hand-edit it), and secrets go through the normal encrypted connection
flow, never into the generated files.

## Extensions in chat

Every enabled extension's tools are available to the model in every chat. When
the model uses one, you see it as an **activity step** in the response — tool
use is never invisible.

:::info Plan limits
The number of enabled extensions depends on your plan — see
[neatcontext.com/pricing](https://www.neatcontext.com/pricing).
:::

## Next

- Try a complete, ready-made extension in the
  [Incident Analysis walkthrough](../guides/incident-analysis.md).
- Write your own connector: [Building Extensions](../extensions/overview.md).
