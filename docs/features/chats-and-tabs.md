---
sidebar_position: 1
---

# Chats & Tabs

Everything in NeatContext happens in a **chat**. Each chat lives in its own **tab**
across the top of the window, and — this is the important part — **each tab carries
its own context**: its own domain profiles and its own knowledge folders. Switch
tabs and you switch the entire working context, not just the conversation history.

![Chat tabs across the top of the window — here one tab per team](/img/features/chat-tabs.png)

## The chat workspace at a glance

![A chat tab with its own profile and knowledge folder attached](/img/features/workspace-context.png)

- **Tab strip (top)** — one tab per chat, plus a **+** button for a new chat.
- **Sidebar (left)** — the current tab's context: its **Domain Profiles** and its
  **Knowledge Base** folders. Whatever you import or add here attaches to the tab
  you are on.
- **Top bar** — your model, the **Extensions** page, your account, and the
  currently **active profile** for this tab.
- **Conversation + composer (center)** — the messages, and the
  *"Message NeatContext"* box at the bottom. Press **Enter** to send
  (**Shift+Enter** for a new line).

:::note A chat needs a profile
Sending a message requires the tab to have an **active domain profile** — context
is the point, so NeatContext won't run without at least a minimal one. See
[Domain Profiles](./domain-profiles.md).
:::

## Creating and naming chats

Click the **+** at the end of the tab strip to open a new chat.

A new tab **branches from the tab you were on**: it starts with the same profiles
and knowledge folders attached. That makes the common case fast — continue the
same investigation in a fresh conversation — and the other case easy: detach what
you don't want (the **✕** next to each profile/folder) and attach something else.
Detaching only affects the current tab; every other tab keeps its own setup.

A chat is titled from your **first message** in it, so tabs stay recognizable
without any manual naming.

## Reading a response

When you send a message, NeatContext assembles the tab's context (active profile +
knowledge snippets), sends it to your model, and **streams** the answer live. Along
the way you'll see:

- **Activity steps** above the answer — what the assistant is doing right now:
  reasoning steps and each **tool call** it makes (for example
  `demo_get_incident` or `local_knowledge_search`), so tool use is never invisible.
- **Sources** under the answer — when the response drew on your knowledge base,
  the documents it used appear as **clickable chips**. Click one to open the cited
  file at the cited lines. This is how you verify an answer instead of trusting it.
- **Connect buttons** — if a tool needed a service you haven't connected yet, the
  answer ends with a **Connect &lt;Extension&gt;** button that takes you straight
  to the fix.

Want a real example? The
[Incident Analysis walkthrough](../guides/incident-analysis.md) shows a streamed,
tool-calling, source-cited investigation end to end.

## Controls while a response is streaming

- The **send button turns into a stop button** (a square). Click it to cut the
  response short — useful when you can already see it going in the wrong direction.
- A tab that is busy shows a **pulsing dot**; a tab that finished while you were
  elsewhere shows a **"new response" dot**. You can run investigations in several
  tabs at once and come back to each result.

## Edit & resend

Hover over any of your previous messages and click the **pencil** icon to edit it.
Sending the edited prompt **replaces the conversation from that point on** — the
messages after it are discarded and the model answers the corrected question.
This is usually better than appending "no, I meant…" because the model re-answers
from a clean state.

## Deleting a chat

Click the **✕** on the tab. NeatContext asks for confirmation — deleting a chat
discards its conversation and cannot be undone. (The profiles and knowledge
folders it used are *not* deleted; they stay available to other tabs.)

## One incident, two tabs

Per-tab context is what makes NeatContext's core trick possible: keep **Team A's
profile + runbooks in one tab** and **Team B's in another**, ask both the same
question, and compare the answers side by side — no swapping context in and out.
The [Incident Analysis walkthrough](../guides/incident-analysis.md) is built
around exactly this.

:::info Basic plan limits
On the **Basic** plan a workspace can have up to **2 chats**, each with up to
**2 profiles** and **3 knowledge folders** attached. If your plan changes from
Plus back to Basic, extra chats are **locked** (not deleted) — they keep their
messages and unlock the moment you return to Plus. See
[Account & Plans](./account-and-plans.md).
:::
