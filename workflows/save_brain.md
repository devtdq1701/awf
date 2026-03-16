---
description: Save project knowledge
---

# WORKFLOW: /save-brain - The Infinite Memory Keeper v2.1

You are **Antigravity Librarian**. Mission: Fight "Context Drift" — ensure AI never forgets.

**Principle:** "Code changes → Docs change IMMEDIATELY"

---

## Proactive Handover (AWF 2.0)

> When context >80% full, AUTO-CREATE Handover Document.

### Trigger:

- Context window >80%
- Conversation >50 messages
- Before complex questions

### Handover Document:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Working on: [Feature name]
At step: Phase [X], Task [Y]

DONE:
   - Phase 01: Setup (complete)
   - Phase 02: Database (3/3 tasks)
   - Phase 03: Backend (2/5 tasks)

REMAINING:
   - Task 3.3: Create order API
   - Phase 04, 05, 06

KEY DECISIONS:
   - Used Supabase (user wants free tier)
   - No dark mode (deferred to phase 2)
   - Prisma over raw SQL

NOTES FOR NEXT SESSION:
   - src/api/orders.ts in progress
   - /payments API untested
   - SPECS-03 has special acceptance criteria

KEY FILES:
   - docs/SPECS.md (main scope)
   - .brain/session.json (progress)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Saved! To continue: type /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### After Handover:

1. Save to `.brain/handover.md`
2. Update session.json with current state
3. Notify user: "Context nearly full, saved progress. Continue now or `/recap` in new session."

---

## Non-Tech Mode (v4.0)

Read `preferences.json`:

```text
if technical_level == "newbie":
    → Hide JSON structure, explain as benefits
    → Just ask: "Save what I learned about your project?"
    → Don't mention file names (brain.json, session.json) → just say "saved"
```

---

## Phase Execution Order

> **MANDATORY phases run FIRST, then OPTIONAL. NEVER skip MANDATORY phases.**

```text
┌─── MANDATORY (always run) ──────────────┐
│ Phase 1: Change Analysis                │
│ Phase 2: .brain/ Update                 │
│ Phase 3: MCP Memory Sync               │
└─────────────────────────────────────────┘
        ↓
┌─── OPTIONAL (run if applicable) ────────┐
│ Phase 4: Documentation Update           │
│ Phase 5: Codebase Docs                  │
│ Phase 6: Pattern Extraction             │
│ Phase 7: Deployment Config              │
└─────────────────────────────────────────┘
        ↓
┌─── MANDATORY ───────────────────────────┐
│ Phase 8: Confirmation                   │
└─────────────────────────────────────────┘
```

---

## Phase 1: Change Analysis [MANDATORY]

### 1.1. Ask or Auto-Detect

- "What important changes did we make today?"
- Or: "Let me scan the modified files."

### 1.2. Classify Changes

| Type      | Examples                        | Action                           |
| --------- | ------------------------------- | -------------------------------- |
| **Major** | New module, DB change, new API  | Update architecture + brain.json |
| **Minor** | Bug fix, refactor, style change | Note in session log only         |

---

## Phase 2: .brain/ Update [MANDATORY]

> **CORE PURPOSE of /save-brain. NEVER skip this phase.**
> MUST run BEFORE MCP Memory Sync — brain.json is the primary data source.

### 2.1. Check .brain/ Directory

```text
If .brain/ exists → update brain.json + session.json
If .brain/ NOT exists → create .brain/ + brain.json + session.json
```

### 2.2. .brain/ Directory Structure

```text
.brain/
├── brain.json          # Static knowledge (rarely changes)
├── session.json        # Dynamic session (changes often)
└── preferences.json    # Local override (if differs from global)
```

### 2.3. Update brain.json (Static Knowledge)

Keys: `meta`, `project`, `tech_stack`, `database_schema`, `api_endpoints`, `business_rules`, `features`, `knowledge_items`

**When to update:**

| Trigger            | Section               |
| ------------------ | --------------------- |
| New API            | api_endpoints         |
| DB change          | database_schema       |
| New dependency     | tech_stack            |
| New feature        | features              |
| Important decision | decisions (add entry) |

**How:** Scan package.json → tech_stack, schema → database_schema, API routes → api_endpoints, specs → features.

### 2.4. Update session.json (Dynamic Session)

Keys: `updated_at`, `working_on` (feature/task/status/files), `pending_tasks`, `recent_changes`, `errors_encountered`, `decisions_made`

**Always update:**

- Modified files → `recent_changes`
- Current task → `working_on`
- Errors encountered → `errors_encountered`
- Decisions made → `decisions_made`

### 2.5. Validate & Save

- Ensure valid JSON before saving
- brain.json → `.brain/` (gitignore or commit for team share)
- session.json → always in `.gitignore` (local state)

---

## Phase 3: MCP Memory Sync [MANDATORY]

> Save concise knowledge for quick cross-session recall.
> Run AFTER Phase 2 — compare with brain.json to avoid duplication.

### 3.1. Should We Store to Memory?

Store when **at least 1** is true:

- [ ] Cross-project: applies to multiple projects
- [ ] Quick-recall: need to remember without opening files/KI
- [ ] User preference: personal decision affecting workflow
- [ ] Not in `.brain/` or KI (avoid duplication)

**DON'T store** when: KI already exists (more detailed), info too long (>500 chars).

### 3.2. How to Store

```text
Content: [Concise, actionable knowledge]
Tags:    [project-name, topic, type]
Type:    fact | decision | gotcha | preference
```

### 3.3. Principles

- **Concise**: 1-3 sentences, enough to recall without reading more
- **Actionable**: Must include what to do / what to avoid
- **Tagged**: Always tag for search_by_tag
- **No duplicates**: Check `retrieve_memory` before storing

---

## Phase 4: Documentation Update [IF docs/ exists]

> Skip if project has no `docs/` directory.

### 4.1. System Architecture

- File: `docs/architecture/system_overview.md`
- Update when: new module, new 3rd-party API, DB changes

### 4.2. Database Schema

- File: `docs/database/schema.md`
- Update when: new table, new column, new relationship

### 4.3. API Documentation

Ask: Markdown only / OpenAPI / Both / Skip?
Scan API routes → create/update `docs/api/endpoints.md` (Method, Path, Description, Request/Response, Errors).

### 4.4. Business Logic

- File: `docs/business/rules.md`
- Save business rules discovered during coding

### 4.5. Spec Status

- Move specs: Draft → Implemented
- Note any deviations from original plan

---

## Phase 5: Codebase Docs [IF README exists]

> Skip if project has no README.md or CHANGELOG.md.

### 5.1. README

- Update setup instructions for new dependencies
- Document new environment variables

### 5.2. Inline Documentation

- Check complex functions have JSDoc/docstrings
- Suggest where comments are needed

### 5.3. Changelog

```markdown
# Changelog

## [YYYY-MM-DD]

### Added

- [New feature]

### Changed

- [Modification]

### Fixed

- [Bug fix]
```

---

## Phase 6: Pattern Extraction [IF non-trivial problem solved]

> Skip if session only had trivial changes (typos, config tweaks).
> Extract reusable patterns into skills. One pattern per skill, focused and actionable.

### 6.1. Session Review

| Category                 | What to Look For                                                   |
| ------------------------ | ------------------------------------------------------------------ |
| **Error Resolution**     | Error + root cause + fix. Reusable for similar errors?             |
| **Debugging Techniques** | Non-obvious steps, tool combinations that worked                   |
| **Workarounds**          | Library quirks, API limitations, version-specific fixes            |
| **Project Patterns**     | Codebase conventions, architecture decisions, integration patterns |

### 6.2. Extraction Criteria

**EXTRACT** when:

- Pattern saved >10 min of work
- Likely to recur in future sessions
- Non-trivial (not typos or simple syntax)
- Reusable across projects or modules

**DON'T EXTRACT:**

- One-time issues (API outage, temp config)
- Trivial fixes (missing import, typo)
- Already documented in existing skill/KI

### 6.3. Skill File Format

Save to `~/.gemini/skills/learned/[pattern-name]/SKILL.md`:

```markdown
---
name: [pattern-name]
description: [One-line description. Keywords for auto-activation.]
---

# [Descriptive Pattern Name]

Extracted: [Date] | From: [Project/Context]

## Problem

[What problem this solves — be specific]

## Solution

[The pattern/technique/workaround]

## Example

[Code example if applicable]

## When to Use

[Trigger conditions — what should activate this skill]
```

### 6.4. Process

1. Review session for extractable patterns
2. Identify the most valuable/reusable insight
3. Draft skill file
4. **Ask user to confirm** before saving
5. Save to `~/.gemini/skills/learned/`
6. Store reference in MCP Memory (for cross-session recall)

---

## Phase 7: Deployment Config [IF deploying]

> Skip if not a deployable project.

### 7.1. Environment Variables

- Update `.env.example` with new variables + descriptions

### 7.2. Infrastructure

- Document server/hosting config and scheduled tasks

---

## Phase 8: Confirmation [MANDATORY]

```text
"Updated project memory:
  .brain/ → brain.json + session.json ✅
  MCP Memory → [N] items stored ✅
  [+ docs updated if applicable]
  [+ skill saved if extracted]

Brain Stats: Tables: X | APIs: Y | Features: Z | Pending: N

Tomorrow use /recap to restore full context."
```

---

## BEST PRACTICES:

- Run `/save-brain` after each major feature
- Run `/save-brain` at end of work day
- Run `/save-brain` before long breaks

---

## NEXT STEPS:

```text
1️⃣ Done for today? Rest!
2️⃣ Coming back tomorrow? /recap to restore context
3️⃣ Continue working? /plan or /code
```

> 🛡️ **RESILIENCE:** See `_shared/resilience.md` — Auto-retry, timeout, JSON corruption recovery.
