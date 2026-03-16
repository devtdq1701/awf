# Antigravity Workflow Framework (AWF)

> **Transform your AI coding assistant into a structured software development team.**

AWF is a prompt engineering framework that turns AI assistants (Gemini, Claude, etc.) into specialized personas — PM, Developer, Designer, Detective, Auditor — each with dedicated workflows, checklists, and safety guardrails.

## Why AWF?

**Problem:** AI coding assistants answer correctly but lack **process** — no code review, no testing, no edge case handling, no context persistence.

**Solution:** AWF wraps every task in a structured workflow with phases, checklists, and anti-rationalization guards.

```
AI PROPOSES → User APPROVES → AI EXECUTES → AI SELF-CHECKS
```

## Core Principles

| Principle | Description |
| --- | --- |
| **AI-First Proposal** | AI proposes solutions first, user only approves/adjusts |
| **Persona-Driven** | Each workflow has a dedicated expert persona |
| **Context Never Lost** | Lazy Checkpoint + Proactive Handover = no lost context between sessions |
| **Non-Tech Friendly** | Every workflow supports non-technical users with plain language |
| **Anti-Rationalization** | Tables of common AI excuses that are explicitly blocked |

## Architecture

```
~/.gemini/
├── GEMINI.md                      # Global rules (your customization)
├── antigravity/
│   ├── global_workflows/          # 22 workflow files
│   │   └── _shared/              # 5 shared protocols
│   ├── skills/                    # 8 built-in skills
│   ├── schemas/                   # JSON schemas for .brain files
│   └── templates/                 # Example configs
```

### 3-Tier Architecture

```
┌─────────────────────────────┐
│  Tier 1: Agent Layer        │  ← GEMINI.md (global rules, persona)
├─────────────────────────────┤
│  Tier 2: Workflow Layer     │  ← /brainstorm, /plan, /code, /debug...
│  └── Shared Protocols       │  ← _shared/ (resilience, token-discipline)
├─────────────────────────────┤
│  Tier 3: Skill Layer        │  ← awf-* skills (auto-activated)
│  └── Custom Skills          │  ← Your own skills
└─────────────────────────────┘
```

## Workflows (22)

### Development Lifecycle

| Command | Persona | Role |
| --- | --- | --- |
| `/init` | Project Initializer | Capture idea, create workspace |
| `/brainstorm` | Research Analyst | Explore & validate ideas, create BRIEF.md |
| `/plan` | PM (10yr exp) | Features, phases, risk assessment |
| `/design` | Architect (15yr exp) | DB schema, API design, acceptance criteria |
| `/visualize` | UX Designer | UI mockup generation |
| `/code` | Senior Dev (12yr exp) | Implementation with Search-First + Phase Gates |
| `/test` | QA Engineer | Test strategy, flaky detection |
| `/debug` | Detective (8yr exp) | Root cause investigation with Iron Law |
| `/code-review` | Code Reviewer | Pre-commit gate, security checklist |
| `/refactor` | Code Gardener | Readability cleanup, safety tiers |
| `/audit` | Security Eng (10yr exp) | Full checkup, A-F grading |

### Operations

| Command | Role |
| --- | --- |
| `/run` | Auto-detect & launch app |
| `/deploy` | Full production guide (SEO, analytics, legal, backup, monitoring) |
| `/rollback` | Emergency recovery |
| `/recap` | Context recovery from `.brain/` |
| `/save-brain` | Persist knowledge for next session |
| `/review` | Project overview & handover |

### Utilities

| Command | Role |
| --- | --- |
| `/help` | Context-aware help |
| `/next` | AI suggests next action |
| `/customize` | Preferences management |
| `/design-system` | Design DNA + UI component library |
| `/gen-dockerfile` | Secure Docker Architect |

## Recommended Flows

```bash
# New project
/init → /brainstorm → /plan → /design → /code → /test → /deploy

# Daily work
/recap → /code → /run → /test → /save-brain

# Bug fixing
/debug → /test → /rollback (if needed)

# Pre-release
/audit → /code-review → /test → /deploy → /save-brain
```

## Key Features

### Persona System

Each workflow has a named persona with specific traits:

| Persona | Workflow | Style |
| --- | --- | --- |
| **PM** | /plan | "Do less, do well", offers 2-3 options |
| **Architect** | /design | Explains tech in plain language |
| **Senior Dev** | /code | Careful, explains reasoning |
| **Detective** | /debug | Calm, methodical, never rushes |
| **Security Eng** | /audit | Meticulous, pairs problems with solutions |

### Non-Tech Mode

Read from `preferences.json`, supports 3 levels:

- **Newbie**: Hide technical details, emoji errors, 1 question per turn
- **Basic**: Text + diagrams with explanations
- **Technical**: Full technical output

Every workflow includes an error translation table for non-tech users.

### Anti-Rationalization (inspired by [Superpowers](https://github.com/obra/superpowers))

Tables of common AI excuses that are explicitly blocked:

```markdown
| Excuse | Reality |
| ------ | ------- |
| "Simple issue, skip process" | Simple bugs have root causes too. |
| "I already know how to build this" | Search anyway. Existing code saves hours. |
| "Just a small change, no test needed" | Small changes cause the worst bugs. |
```

Applied to 7 workflows: `/brainstorm`, `/plan`, `/code`, `/test`, `/debug`, `/code-review`, `/refactor`.

### Context Management

```
.brain/
├── brain.json        # Static project knowledge
├── session.json      # Dynamic session state
└── preferences.json  # User preferences
```

- **Lazy Checkpoint**: ~20 tokens per task, ~450 per phase
- **Proactive Handover**: Auto-save when context >80% full
- **Cross-session Recovery**: MCP Memory → Knowledge Items → Conversation Logs

### Shared Protocols (`_shared/`)

| Protocol | Purpose |
| --- | --- |
| `context-retrieval.md` | Memory → KI → Logs priority order |
| `iterative-retrieval.md` | Large codebase search (30+ files) |
| `resilience.md` | Auto-retry, timeout, fallback patterns |
| `token-discipline.md` | Context window optimization |
| `gh-cli.md` | GitHub CLI ↔ MCP tool mapping |

### Built-in Skills (8)

| Skill | Purpose |
| --- | --- |
| `awf-adaptive-language` | Adjust terminology by user level |
| `awf-auto-save` | Auto-save session context |
| `awf-context-help` | Context-aware help |
| `awf-error-translator` | Translate errors to plain language |
| `awf-onboarding` | First-time user guide |
| `awf-session-restore` | Lazy-loading context restore |
| `context-minify` | Minify source for ~40-60% token savings |

## Installation

### Quick Start

1. Copy the `workflows/` directory to `~/.gemini/antigravity/global_workflows/`
2. Copy the `skills/` directory to `~/.gemini/antigravity/skills/`
3. Copy `schemas/` and `templates/` to their respective directories
4. Start using: type `/help` in your AI assistant

### Directory Setup

```bash
# Clone the repo
git clone https://github.com/devtdq1701/awf.git /tmp/awf-install

# Copy to Antigravity directory
mkdir -p ~/.gemini/antigravity
cp -r /tmp/awf-install/workflows ~/.gemini/antigravity/global_workflows
cp -r /tmp/awf-install/skills ~/.gemini/antigravity/skills
cp -r /tmp/awf-install/schemas ~/.gemini/antigravity/schemas
cp -r /tmp/awf-install/templates ~/.gemini/antigravity/templates

# Clean up
rm -rf /tmp/awf-install

echo "AWF installed! Type /help to get started."
```

### First Run

```bash
# Initialize preferences
/customize

# Create your first project
/init
```

## Customization

### Adding Custom Workflows

Create a new `.md` file in `workflows/`:

```markdown
---
description: My Custom Workflow
---

# WORKFLOW: /my-workflow - The [Role Name]

You are **[Persona Name]**. [Mission description].

## Phase 1: [Phase Name]
...

## Anti-Rationalization
| Excuse | Reality |
...

## Next Steps
...
```

### Adding Custom Skills

Create a directory in `skills/` with a `SKILL.md`:

```
skills/my-skill/
├── SKILL.md          # Main instructions (required)
├── scripts/          # Helper scripts
└── examples/         # Reference implementations
```

## Credits & Inspiration

- **[AWF Original](https://github.com/TUAN130294/awf)** by **[@TUAN130294](https://github.com/TUAN130294)** — Original creator of the Antigravity Workflow Framework. This repo is a fork with enhancements (Anti-Rationalization, Superpowers-inspired improvements, English translation, additional docs).
- **[Superpowers](https://github.com/obra/superpowers)** — Anti-Rationalization patterns, Iron Law debugging, structured feedback protocols
- **BMAD Method** — Persona-driven workflow design

## License

MIT License — Feel free to use, modify, and share.

---

*AWF — Your dreams, our engineering.*
