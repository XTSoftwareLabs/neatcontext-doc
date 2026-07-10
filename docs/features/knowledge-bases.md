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

## How search works

Retrieval is deliberately simple and fully local:

- Files are chunked into small line-based sections and scored by **keyword
  match** against your question. There are no embeddings and no cloud index —
  nothing leaves your machine at retrieval time.
- The best-matching snippets are added to the model's context, and the model can
  run further searches itself mid-answer through the built-in
  `local_knowledge_search` tool (you'll see those as activity steps).
- Answers that used your documents cite them as **clickable sources** under the
  response — click one to open the file at the cited lines.

### What gets searched

- File types: `.md`, `.markdown`, `.txt`, `.log`, `.json`, `.csv`, `.html`, `.htm`.
- Skipped automatically: `.git`, `node_modules`, `target`, `dist`, `release`,
  `coverage`, and — deliberately — directories named `secrets` or `credentials`.
- Very large files (over 512 KB) are skipped, and a single search examines up to
  400 files, so point NeatContext at focused documentation folders rather than an
  entire home directory.

## Writing knowledge that retrieves well

Because matching is keyword-based, the documents that work best are the ones that
are good for humans too:

- **Use the real names of things** — service names, error strings, config keys.
  A runbook that quotes the exact error
  (`could not obtain connection from pool 'billing-postgres'`) is findable the
  moment that error appears in an incident.
- **One topic per file**, with a descriptive filename (`checkout-api-5xx.md`
  beats `notes3.md`) — filenames and paths count toward matching, and they are
  what you'll see in the source chips.
- **Keep postmortems.** They encode "we've seen this before", which is often the
  fastest route to a diagnosis.

The [incident demo's knowledge folders](https://github.com/XTSoftwareLabs/neatcontext-demo/tree/main/knowledge)
show the pattern: `runbooks/`, `tsg/`, and `postmortems/` per team.

:::info Basic plan limit
The Basic plan allows up to **3 knowledge folders per chat**. See
[Account & Plans](./account-and-plans.md).
:::
