---
sidebar_position: 4
---

# Model Provider

NeatContext does **not** host or resell a model. You bring your own — a cloud API
key or a local model — and NeatContext orchestrates it: requests go **directly
from the app on your machine to the endpoint you configure**, with your profile
and knowledge assembled in.

## Open model settings

Click the **model button** at the left of the top bar (it shows the current model
name, e.g. `gpt-5.4-mini`). That opens the **Model Provider** page:

![The Model Provider settings page](/img/features/model-provider.png)

## Fill in the form

| Field | What to enter |
|---|---|
| **Provider** | Keep **OpenAI-compatible endpoint** — the fully supported provider type today. It covers OpenAI itself and the many services and local runtimes that expose the same API (Azure OpenAI, OpenRouter, Together, vLLM, LM Studio, Ollama, …). The other options are placeholders for upcoming native support. |
| **Base URL** | The API root, e.g. `https://api.openai.com/v1`. For a local Ollama server use `http://localhost:11434/v1`. |
| **Model** | The model name as your provider spells it, e.g. `gpt-5.4-mini`. |
| **API key** | Your key. For local servers that don't check keys, enter any non-empty placeholder — the field must not be blank for live calls. |

Click **Save**. The top bar now shows your model name, and every chat in the
workspace uses this provider.

:::caution Pick a tool-calling model
Extensions only work if the active model supports **function/tool calling** (all
mainstream chat models do). With a non-tool-calling model you still get profiles
and knowledge search, but the model cannot query your systems.
:::

## How your key is stored

The API key is encrypted with your **operating system's secure storage**
(Electron `safeStorage`) and saved locally on your machine. It is never written
in plaintext, never committed to profile files, and never sent anywhere except
to the provider endpoint you configured.

## What happens without a provider

If no usable provider is configured (or the provider errors), NeatContext falls
back to a **grounded mock response**: it still runs retrieval and shows you the
profile and knowledge snippets it *would* have sent. That makes it easy to check
your context assembly — what the model would see — before you spend tokens on it.

## Timeouts

Model requests time out after **30 seconds** by default. For slow local models
you can raise this by setting the `NEATCONTEXT_MODEL_REQUEST_TIMEOUT_MS`
environment variable (in milliseconds) before launching NeatContext.

## How a request is assembled

For every message, NeatContext builds the request from the current tab's context:

1. The **active domain profile** becomes steering context in the system prompt.
2. A **knowledge search** over the tab's folders adds the best-matching snippets.
3. Enabled **extensions' tools** (plus the built-in local tools) are offered to
   the model, which may call them for up to a few rounds before answering.
4. The answer **streams** back, with tool activity and source citations shown in
   the chat.

Change the profile or the folders and you change how the model reasons — the
provider configuration stays the same.
