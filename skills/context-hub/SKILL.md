---
name: context-hub
description: >
  Use this skill when you need documentation for a third-party library, SDK, or API
  before writing code that uses it (e.g., OpenAI API, Stripe, Anthropic, Next.js).
  Keywords: api, docs, documentation, sdk, library, external, chub, integration, fetch.
  Fetch the docs with the `chub` CLI instead of relying on training knowledge to avoid hallucination.
---

# Context Hub (chub) Usage Guide

When asked to write code using an external API or library, ALWAYS use `chub` to fetch the current documentation first. Do not guess or rely purely on your training data.

## Step 1 — Search for the Documentation
```bash
chub search "<library name>" --json
```
Find the relevant `id` (e.g., `openai/chat`, `stripe/api`).

## Step 2 — Fetch the Docs
```bash
chub get <id> --lang py    # Change --lang to js, ts, etc.
```

## Step 3 — Apply Knowledge
Read the fetched markdown output carefully. Use the exact models, endpoints, and snippets as guided by the documentation.

## Step 4 — Annotate (If you find a gap or workaround)
If the documentation is missing something or you had to apply a workaround during implementation, save a short note so you (and future sessions) will remember:
```bash
chub annotate <id> "Your workaround note here (e.g., Webhook verification requires raw body)"
```
These notes are local and persist across sessions. They automatically show up on the next `chub get`.

## Step 5 — Feedback
```bash
chub feedback <id> up --label accurate "Clear examples"
chub feedback <id> down --label outdated "Uses old syntax"
```
Available labels: `outdated`, `inaccurate`, `incomplete`, `wrong-examples`, `wrong-version`, `poorly-structured`, `accurate`, `well-structured`, `helpful`, `good-examples`.

## Quick Reference
- List everything: `chub search`
- Fetch multiple: `chub get openai/chat stripe/api --lang js`
- List annotations: `chub annotate --list`
