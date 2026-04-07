---
name: openclaw-nebius
description: Nebius Token Factory provider plugin — adds 44+ open-source models (Qwen, DeepSeek, Llama, Gemma, GLM, FLUX, and more) to OpenClaw via a single OpenAI-compatible endpoint
version: 1.2.1
homepage: https://github.com/colygon/openclaw-nebius-plugin
metadata: {"openclaw":{"requires":{"env":["NEBIUS_API_KEY"]},"primaryEnv":"NEBIUS_API_KEY"}}
env:
  - name: NEBIUS_API_KEY
    required: true
    description: Nebius Token Factory API key from studio.nebius.ai
---

# Nebius Token Factory Provider Plugin

Adds 44+ open-source models to OpenClaw via the Nebius Token Factory inference API.

## Required Credentials

| Variable | Required | Description |
|----------|----------|-------------|
| `NEBIUS_API_KEY` | Yes | API key from [studio.nebius.ai](https://studio.nebius.ai/) |

## Setup

1. **Get an API key** from [studio.nebius.ai](https://studio.nebius.ai/)

2. **Set the API key** via auth profile or environment variable:

   ```bash
   # Option A: LaunchAgent env var (required for gateway)
   launchctl setenv NEBIUS_API_KEY "v1.YOUR_KEY_HERE"

   # Option B: Auth profile (required for agent)
   # Add to ~/.openclaw/agents/main/agent/auth-profiles.json
   ```

3. **Enable the plugin** in `~/.openclaw/openclaw.json`

4. **Restart the gateway:**
   ```bash
   openclaw gateway restart
   ```

## Supported Models

Chat and reasoning models from: Qwen (3.5, 3, 2.5), DeepSeek (V3.2, R1),
Kimi (K2.5, K2), GLM (5, 4.7, 4.5), NVIDIA Nemotron, Meta Llama, Google Gemma,
NousResearch Hermes, OpenAI GPT-OSS, MiniMax, and PrimeIntellect.

Image generation: FLUX.1 Schnell and FLUX.1 Dev.

All models use the `nebius/` prefix (e.g., `nebius/deepseek-ai/DeepSeek-V3.2`).

See [SETUP.md](https://github.com/colygon/openclaw-nebius-plugin/blob/main/SETUP.md) for the full model catalog and detailed configuration.
