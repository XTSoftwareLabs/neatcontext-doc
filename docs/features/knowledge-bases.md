---
sidebar_position: 3
---

# Knowledge Bases

A **knowledge base** is a local folder of documents — typically a team's
**runbooks**, **troubleshooting guides (TSGs)**, and **postmortems** — that
NeatContext searches when answering. It's what turns "an LLM's general opinion"
into "an answer grounded in *your* documents, with citations you can click".

## Add a folder

In the sidebar's **Knowledge Base** section, click the **add folder** button and
pick a directory. The folder attaches to the **current chat tab** and is searched
from the next message on.

![A knowledge folder attached to the current tab](/img/features/sidebar.png)

Some useful properties:

- **The folder stays yours.** NeatContext reads it in place — nothing is copied
  or uploaded. Keep runbooks in the git repo where they already live; edits are
  picked up automatically on the next search.
- **Several folders per tab.** Attach as many as the topic needs (runbooks +
  postmortems + architecture notes, say).
- **Per-tab attachment.** Like profiles, folders attach to the tab you're on.
  The **✕** detaches a folder from this tab only; other tabs and the folder on
  disk are untouched.
- Click a folder's name to see its full path; double-click to reveal it in your
  file explorer.

## How it shows up in answers

When your question touches something in an attached folder, the relevant
documents inform the answer, and the ones that were used appear as **clickable
sources** under the response — click one to open the file at the relevant lines.
Searches run **locally on your machine**.

Text-based documents work best — Markdown, plain text, logs, JSON, CSV, HTML.
Common non-content directories (like `.git`, `node_modules`, and build outputs)
are skipped automatically, but folders work best when they're focused
documentation folders rather than an entire home directory.

## Tips for a good knowledge base

The documents that work best for NeatContext are the ones that are good for
humans too:

- **Use the real names of things** — service names, error strings, config keys.
  A runbook that quotes the exact error
  (`could not obtain connection from pool 'billing-postgres'`) is easy to find
  the moment that error appears in an incident.
- **One topic per file**, with a descriptive filename (`checkout-api-5xx.md`
  beats `notes3.md`) — the filename is also what you'll see in the source chips.
- **Keep postmortems.** They encode "we've seen this before", which is often the
  fastest route to a diagnosis.

The [incident demo's knowledge folders](https://github.com/XTSoftwareLabs/neatcontext-demo/tree/main/knowledge)
show the pattern: `runbooks/`, `tsg/`, and `postmortems/` per team.

:::info[Plan limits]
The number of knowledge folders per chat depends on your plan — see
[neatcontext.com/pricing](https://www.neatcontext.com/pricing).
:::
