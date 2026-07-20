---
sidebar_position: 2
---

# Using the PagerDuty Extension

NeatContext ships a **built-in PagerDuty connector**: three read-only incident
tools your connected AI client can call while you investigate — incident details,
related incidents, and similar past incidents. It connects with **OAuth** (you sign
in through your browser; no API keys to create), and it can only *read*: it never
acknowledges, resolves, or modifies anything in your PagerDuty account.

This guide walks through connecting it and using it from your AI client, step by step.

## Prerequisites

- **NeatContext** installed, and a **supported AI client** installed and signed in
  (see [Getting Started](../getting-started.md)). NeatContext brings no model.
- A **PagerDuty account** you can sign into in your browser. Any user that can
  view incidents is enough — the connection asks only for **read** access.

## Step 1 — Find the PagerDuty card

Open the **Extensions** page. PagerDuty ships bundled, so its card is already
there, marked *Built-in* — nothing to add or install. Make sure it is **enabled**,
and select it into the Context you'll connect.

The card lists the three tools it gives your AI client (hover a tool for its
description):

| Tool | What it does |
|---|---|
| `neatcontext_pagerduty_get_incident` | Fetch one incident's details: title, status, urgency, priority, service, assignments, plus its recent **log entries** (the incident timeline). |
| `neatcontext_pagerduty_get_related_incidents` | Incidents related to a given one **right now** — correlated by machine-learning grouping, service dependencies, or a shared likely cause. |
| `neatcontext_pagerduty_get_past_incidents` | **Past** incidents similar to a given one, ranked by similarity — earlier occurrences that look like duplicates or recurrences. |

## Step 2 — Connect through your browser

1. Click **Connect** on the PagerDuty card.

   ![The PagerDuty card with its Connect button](/img/features/extension-pagerduty-card.png)

2. Your **system browser** opens on PagerDuty's sign-in page. Sign in (if you
   aren't already) and **authorize** the requested read access.
3. PagerDuty redirects back to NeatContext, which catches the redirect
   locally and stores the tokens. The card now shows the connection as active.

That's the whole setup. The tokens are **encrypted with your OS secure
storage**, never leave your machine, and are **refreshed automatically** — you
won't be asked to sign in again during normal use.

:::info[The browser flow uses a localhost redirect]
The sign-in round trip finishes on a temporary local address
(`http://localhost:48973/...`) that exists only for the seconds the flow is in
progress. If a firewall prompt appears, allow it — nothing is listening outside
that moment.
:::

## Step 3 — Ask about an incident

In any chat, reference an incident in whichever form you have at hand — the
tools accept all three:

- the **incident URL** you'd copy from your browser or a Slack alert, e.g.
  `https://your-subdomain.pagerduty.com/incidents/Q3XYZ12ABC45DE`
- the **incident ID** (`Q3XYZ12ABC45DE`)
- the **incident number** (`4211`)

Some prompts to try:

```text
Summarize https://acme.pagerduty.com/incidents/Q3XYZ12ABC45DE —
who's assigned, and what does the timeline show so far?
```

```text
Are there incidents related to Q3XYZ12ABC45DE right now?
```

```text
Has incident 4211 happened before? Find similar past incidents.
```

Your AI client shows each PagerDuty tool call as it makes it, and the call is also
recorded in the Context's [activity log](../features/context-activity.md); tool use
is never invisible. And because this is NeatContext, the answer is shaped by the
Context's **domain profile** and grounded in its **knowledge folders**: pair the
PagerDuty tools with your team's runbooks and the AI triages the incident *your
team's* way (see the
[Incident Analysis walkthrough](./incident-analysis.md) for that pattern
end-to-end).

### What each tool accepts

You normally never spell these out — your AI fills them in — but knowing the
knobs helps you phrase requests:

- **Incident details** can include or skip the incident's log entries
  ("give me the details without the timeline"), and fetch more of them
  ("include the last 50 log entries" — up to 100).
- **Past incidents** returns the 5 most similar by default; ask for more
  ("find the 20 most similar past incidents") up to 999.

## Troubleshooting

- **The answer says PagerDuty isn't connected** — you asked an incident question
  before connecting. Connect PagerDuty on the Extensions page, then ask again.
- **It was working, now it asks to reconnect** — the stored token was revoked
  or could not be refreshed (e.g. your PagerDuty session was removed by an
  admin). Click **Connect** again; the browser round trip repairs it.
- **"PagerDuty is connected, but the OAuth token does not have permission…"** —
  your PagerDuty user can sign in but can't read that incident (or that
  account's data). Check with your PagerDuty admin that your user can view the
  incident in the PagerDuty web UI; if you can see it there, you can read it
  here.
- **"Could not find a PagerDuty incident ID, number, or incident URL"** — the
  reference didn't parse. Paste the full incident URL; that form is always
  unambiguous.

## Disconnecting

Click **Disconnect** on the PagerDuty card to delete the stored tokens from
your machine. The card returns to its unconnected state; connect again anytime.

## Next

- Pair incident tools with team runbooks:
  [Incident Analysis walkthrough](./incident-analysis.md).
- Add log search alongside it:
  [Using the Datadog Extension](./datadog-extension.md).
- Curious how it works? The extension is a reference implementation — click the
  **folder icon** on its card to read the source, and see
  [OAuth Extensions](../extensions/oauth-extensions.md) to build your own.
