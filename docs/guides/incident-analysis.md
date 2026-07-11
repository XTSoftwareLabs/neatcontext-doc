---
sidebar_position: 1
---

# Incident Analysis Walkthrough

This walkthrough demonstrates the core advantage of NeatContext: **giving an LLM a
team's domain knowledge changes how it investigates an incident.** You will analyze
the *same* incident as two different teams — each in its own chat tab — and watch
it correctly reach two *different* outcomes: one team hands the incident off, the
other finds and fixes the root cause.

It uses the open
**[NeatContext incident-analysis demo](https://github.com/XTSoftwareLabs/neatcontext-demo)**,
which ships three tiny local mock systems (incident management, logs,
deployments), a connector extension, two team profiles, and each team's runbooks.
Everything runs on your machine; nothing touches real infrastructure.

:::info[Why this matters]
Between the two investigations, the **only** things that change are the profile
and the knowledge folder each tab carries. The incident, the tools, and the raw
evidence are identical — yet each team arrives at its own correct action. That is
the whole point.
:::

## The scenario

A single SEV2 fires: **`INC-1001` — elevated 5xx error rate on `checkout-api`.**

There is one true root cause: at **08:58** the Infra Team cut the pgbouncer
`default_pool_size` from **100 → 40**, which starved the `billing-postgres`
connection pool. `checkout-api` (owned by Payments) is a **victim**, not the cause —
its 5xx began at **09:02**, *before* the Payments deploy at **09:05**, and the
payment provider is healthy the whole time.

The right *action*, though, depends on which team is looking:

| | **Payments Engineering** | **Infra Team** |
|---|---|---|
| Owns | checkout-api, invoice-worker, webhooks | billing-postgres, **pgbouncer**, kafka, mesh |
| What it finds | 5xx predates our deploy; provider healthy; dominant error is DB-pool exhaustion we don't own | the 08:58 pgbouncer `default_pool_size` 100→40 change starved the pool |
| Correct outcome | **Not our root cause → hand off to Infra** with evidence | **Root cause found → revert pool size + RELOAD**, verify, monitor |
| Guardrail it enforces | don't touch pgbouncer/Postgres — escalate | **don't fail over the Postgres primary** during business hours |

## Prerequisites

- **Node.js 18+** — to run the mock systems (`node --version`).
- **openssl** — to generate the demo's self-signed TLS cert (ships with Git;
  standard on macOS/Linux). Check with `openssl version`.
- **NeatContext** installed, with a **tool-calling-capable** model configured and
  active (see [Getting Started](../getting-started.md)).

## Step 1 — Get the demo

```bash
git clone https://github.com/XTSoftwareLabs/neatcontext-demo.git
cd neatcontext-demo
```

There are **no dependencies to install** — the mock systems use only the Node
standard library.

## Step 2 — Start the mock systems

```bash
node servers/index.js
```

On first run it generates a self-signed certificate, then serves all three systems
over HTTPS:

![The three mock systems running, and the incident URL to paste](/img/demo/02-start-servers.png)

**Leave this terminal running** for the rest of the walkthrough. Optional sanity
check: open `https://localhost:7801/incidents/INC-1001` in a browser (accept the
self-signed-cert warning) — you should get the incident JSON. The extension needs
no such acceptance; it is configured to trust the demo cert.

:::tip[Port already in use?]
Override with env vars, e.g.
`INCIDENT_PORT=8801 LOG_PORT=8802 DEPLOY_PORT=8803 node servers/index.js`, then point
the extension at them with the matching `NEATCONTEXT_DEMO_*_BASE` variables (see the
demo README's *Customizing* section).
:::

## Step 3 — Open NeatContext and check your model

Launch NeatContext. Your active model shows in the top bar; if it doesn't, set it
up now ([Getting Started, Step 3](../getting-started.md#step-3--connect-your-model)).
The workspace starts with a single chat tab — in Steps 5 and 6 each team gets its
own tab, with its own profile and knowledge base:

![Freshly opened NeatContext — the model button shows your model](/img/demo/03-open-neatcontext.png)

## Step 4 — Add and enable the extension

1. Open the **Extensions** page from the top bar.
2. Click **Add** and select the demo's **`extension/`** folder (the one containing
   `neatcontext-extension.json`). NeatContext copies it into its own data
   directory and loads **Ops Demo Systems**.
3. Make sure it's **enabled**. There is nothing to authenticate — it talks
   straight to the local mock systems.

It exposes three read-only tools to the model:

- `demo_get_incident` — incident details + timeline
- `demo_search_logs` — log lines for a service/time window
- `demo_list_deployments` — recent deploys (change, owning team, risk, rollback)

![Ops Demo Systems enabled, with its three demo tools](/img/demo/04-extensions.png)

## Step 5 — Investigate as Team A: Payments Engineering

Each chat tab carries its own profile and knowledge base, so every team gets its
own tab. Whatever you import or add attaches to the tab you're on.

1. **Import the profile into this tab.** Under **Domain Profiles**, click
   **Import** and choose **`profiles/payments-team.md`**. Make it the **active**
   profile (it will show *"Active in this chat"*).
2. **Add the knowledge base to this tab.** Under **Knowledge Base**, add the
   folder **`knowledge/payments-team`**.

This tab now has **only** the Payments profile and **only** its knowledge base —
the model reasons strictly from this team's context:

![The Payments tab: only its own profile and knowledge base](/img/demo/05-payments-workspace.png)

3. **Ask, in this tab:**

```text
Please analyze incident https://localhost:7801/incidents/INC-1001.
What should we check first, and what's the safe action?
```

**What you should see.** The model calls `demo_get_incident`, then
`demo_search_logs` / `demo_list_deployments` (watch the activity steps above the
answer), searches the Payments runbooks, and runs the profile's "is this ours?"
triage:

- the 5xx started **09:02, before** the 09:05 checkout-api deploy → our deploy
  isn't the trigger;
- the payment provider is **healthy** → not the provider;
- the dominant error is `could not obtain connection from pool 'billing-postgres'`
  → the binding constraint is the **DB connection pool**, which Infra owns.

![The Payments analysis: pool exhaustion owned by Infra — hand off](/img/demo/06-payments-answer.png)

➡️ **Correct outcome for Payments:** this is **not our root cause — escalate /
hand off to Infra Team**, with the evidence. A good investigation can correctly
end in a hand-off.

Notice the two levers at work in the screenshot: the answer is **grounded in the
Payments knowledge base** — it cites `checkout-api-5xx.md`,
`service-ownership.md`, and the hand-off postmortem as **clickable sources** —
and the **profile shapes the response**, applying the "is this ours?" triage and
the "don't touch Infra's surface — hand off" rule.

## Step 6 — Investigate the SAME incident as Team B: Infra Team

No swapping — **give Infra its own tab** and leave the Payments tab exactly as it
is.

1. **Open a new tab** with the **+** next to the chat tabs. A new tab branches
   from the one you were on, so it starts with Payments' context attached.
2. **Make this tab Infra's.** Click the **✕** on the Payments profile and on the
   `payments-team` folder — that detaches them from *this tab only*; the Payments
   tab keeps them. Then **Import** **`profiles/infra-team.md`** (make it active)
   and add the folder **`knowledge/infra-team`**.

This Infra tab now searches **only Infra's runbooks**. Click back to the Payments
tab — its profile and knowledge base are still there; each tab remembers its own:

![The Infra tab with its own profile and knowledge base](/img/demo/07-infra-tab.png)

3. Ask the **exact same question** with the **same incident URL** as Step 5.

**What you should see.** Same tools, same data — but now the model owns the root
cause. It zeroes in on the **08:58 pgbouncer `default_pool_size` 100 → 40
change**, confirms the Postgres primary is healthy (so it's the pool ceiling, not
the database), and gives the fix and next actions: **revert `default_pool_size`
to 100 and RELOAD pgbouncer** (no dropped connections), verify the pool drains
and the 5xx clears, then monitor pool utilization. It **warns not to fail over
the primary** — straight from Infra's TSG.

![The Infra analysis: the 08:58 pgbouncer pool-size change is the root cause](/img/demo/08-infra-answer.png)

Flip between the two tabs and compare: **same incident, hand-off in one tab,
root-cause fix in the other.**

## What the demo proves

- **Domain profiles steer reasoning toward the team's correct action.** The only
  difference between the tabs is the profile + knowledge folder each carries.
  Same incident, same tools, same raw evidence — two right answers.
- **Each tab keeps its own context.** Both investigations stay side by side in
  one workspace; nothing was swapped in or out.
- **The knowledge base grounds the answer.** Each team's runbooks/TSGs/postmortems
  give the model team-specific first-checks and *dangerous-action* rules it would
  not otherwise know — and the citations let you verify.
- **The extension is just an MCP connector.** Point the same pattern at *your*
  real incident/log/deploy systems and it works beyond the demo.

## Take it further

- Point the extension at real systems by setting the `NEATCONTEXT_DEMO_*_BASE`
  environment variables to your own incident/log/deploy APIs.
- Learn to build your own connector in
  **[Building Extensions](../extensions/overview.md)** — the demo's `server.cjs`
  is authored exactly like any third-party extension.
