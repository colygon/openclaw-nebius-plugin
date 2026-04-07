# Nebius Token Factory Provider Plugin for OpenClaw

A provider plugin that gives OpenClaw access to 44+ open-source models via Nebius's OpenAI-compatible inference API — including Qwen, DeepSeek, GLM, Llama, Gemma, FLUX, and more.

---

## Prerequisites

- OpenClaw `>= 2026.3.24`
- A Nebius Token Factory API key from [studio.nebius.ai](https://studio.nebius.ai/)

---

## Installation

### 1. Set the API key for the gateway

The OpenClaw gateway runs as a macOS LaunchAgent. Shell env vars from `.zshrc`/`.bashrc` are **not** visible to it. Use `launchctl`:

```bash
launchctl setenv NEBIUS_API_KEY "v1.YOUR_KEY_HERE"
```

### 2. Add the auth profile

Edit `~/.openclaw/agents/main/agent/auth-profiles.json`.

Add `"nebius:default"` inside `"profiles"`:

```json
"nebius:default": {
  "type": "api_key",
  "provider": "nebius",
  "key": "v1.YOUR_KEY_HERE"
}
```

Add `"nebius"` inside `"lastGood"`:

```json
"nebius": "nebius:default"
```

Full example:

```json
{
  "version": 1,
  "profiles": {
    "openai:default": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-proj-..."
    },
    "nebius:default": {
      "type": "api_key",
      "provider": "nebius",
      "key": "v1.YOUR_KEY_HERE"
    }
  },
  "lastGood": {
    "openai": "openai:default",
    "nebius": "nebius:default"
  }
}
```

### 3. Enable the plugin

Edit `~/.openclaw/openclaw.json`.

Under `plugins.entries`:

```json
"nebius": {
  "enabled": true
}
```

Under `plugins.installs`:

```json
"nebius": {
  "source": "path",
  "installPath": "/Users/colinlowenberg/.openclaw/extensions/openclaw-nebius",
  "version": "1.0.0"
}
```

### 4. Set Nebius as the default model (optional)

In `~/.openclaw/openclaw.json` under `agents.defaults.model`:

```json
"model": {
  "primary": "nebius/zai-org/GLM-5"
}
```

### 5. Restart

```bash
openclaw gateway restart
```

---

## Available Models

| Model | Type | Input $/1M | Output $/1M |
|-------|------|-----------|-------------|
| `Qwen/Qwen3.5-397B-A17B` | Text | $0.60 | $3.60 |
| `Qwen/Qwen3-Coder-480B-A35B-Instruct` | Text | $0.40 | $1.80 |
| `Qwen/Qwen3-235B-A22B-Thinking-2507` | Reasoning | $0.20 | $0.80 |
| `Qwen/Qwen3-235B-A22B-Instruct-2507` | Text | $0.20 | $0.60 |
| `Qwen/Qwen3-Next-80B-A3B-Thinking` | Reasoning | $0.15 | $1.20 |
| `Qwen/Qwen3-32B` | Text | $0.10 | $0.30 |
| `Qwen/Qwen3-30B-A3B-Thinking-2507` | Reasoning | $0.10 | $0.30 |
| `Qwen/Qwen3-30B-A3B-Instruct-2507` | Text | $0.10 | $0.30 |
| `Qwen/Qwen3-Coder-30B-A3B-Instruct` | Text | $0.10 | $0.30 |
| `Qwen/Qwen2.5-VL-72B-Instruct` | Text | $0.25 | $0.75 |
| `Qwen/Qwen2.5-Coder-7B` | Text | $0.03 | $0.09 |
| `deepseek-ai/DeepSeek-V3.2` | Text | $0.30 | $0.45 |
| `deepseek-ai/DeepSeek-R1-0528` | Reasoning | $0.80 | $2.40 |
| `deepseek-ai/DeepSeek-V3-0324` | Text | $0.50 | $1.50 |
| `zai-org/GLM-5` | Text | $1.00 | $3.20 |
| `zai-org/GLM-4.7` | Text | $0.40 | $2.00 |
| `zai-org/GLM-4.5` | Text | $0.60 | $2.20 |
| `zai-org/GLM-4.5-Air` | Text | $0.20 | $1.20 |
| `moonshot-ai/Kimi-K2.5` | Text | $0.50 | $2.50 |
| `moonshot-ai/Kimi-K2-Instruct` | Text | $0.50 | $2.40 |
| `moonshot-ai/Kimi-K2-Thinking` | Reasoning | $0.60 | $2.50 |
| `minimax/MiniMax-M2.5` | Text | $0.30 | $1.20 |
| `minimax/MiniMax-M2.1` | Text | $0.30 | $1.20 |
| `nvidia/Nemotron-3-Super-120b-a12b` | Text | $0.30 | $0.90 |
| `nvidia/Llama-3_1-Nemotron-Ultra-253B-v1` | Text | $0.60 | $1.80 |
| `nvidia/Nemotron-3-Nano-30B-A3B` | Text | $0.06 | $0.24 |
| `nvidia/Nemotron-Nano-V2-12b` | Text | $0.07 | $0.20 |
| `NousResearch/Hermes-4-405B` | Reasoning | $1.00 | $3.00 |
| `NousResearch/Hermes-4-70B` | Reasoning | $0.13 | $0.40 |
| `openai/gpt-oss-120b` | Reasoning | $0.15 | $0.60 |
| `openai/gpt-oss-20b` | Reasoning | $0.05 | $0.20 |
| `PrimeIntellect/INTELLECT-3` | Text | $0.20 | $1.10 |
| `meta-llama/Llama-3.3-70B-Instruct` | Text | $0.13 | $0.40 |
| `meta-llama/Meta-Llama-3.1-8B-Instruct` | Text | $0.02 | $0.06 |
| `meta-llama/Meta-Llama-Guard-3-8B` | Safety | $0.02 | $0.06 |
| `google/Gemma-3-27b-it` | Text | $0.10 | $0.30 |
| `google/Gemma-2-9b-it` | Text | $0.03 | $0.09 |
| `google/Gemma-2-2b-it` | Text | $0.02 | $0.06 |
| `Qwen/Qwen3-Embedding-8B` | Embedding | $0.01 | — |
| `BAAI/bge-multilingual-gemma2` | Embedding | $0.01 | — |
| `BAAI/BGE-ICL` | Embedding | $0.01 | — |
| `intfloat/e5-mistral-7b-instruct` | Embedding | $0.01 | — |
| `black-forest-labs/FLUX.1-schnell` | Image | per image | — |
| `black-forest-labs/FLUX.1-dev` | Image | per image | — |

Reference models with the `nebius/` prefix, e.g. `nebius/Qwen/Qwen3.5-397B-A17B`.

---

## Troubleshooting

**"No API key found for provider nebius"**
- Verify `auth-profiles.json` has the `nebius:default` entry
- Run `launchctl setenv NEBIUS_API_KEY "..."` and restart the gateway

**"Unknown model: ..."**
- Use the fully qualified name: `nebius/org/model-name`
- Run `openclaw models list` to see all registered models

**Config validation errors**
- Run `openclaw doctor --fix`

**Gateway keeps overwriting `models.json`**
- This is normal. The gateway manages `agents/main/agent/models.json` at runtime. The plugin's `index.ts` is the source of truth for the model catalog.

---

## Plugin Structure

```
~/.openclaw/extensions/openclaw-nebius/
  ├── package.json            # Plugin metadata + OpenClaw compat
  ├── openclaw.plugin.json    # Manifest, auth config, configSchema
  ├── index.ts                # Provider registration + full model catalog
  ├── tsconfig.json           # TypeScript config
  └── SETUP.md                # This file
```
