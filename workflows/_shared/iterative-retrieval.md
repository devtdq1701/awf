# Iterative Retrieval — Find the Right Context

> DON'T read all files. Use a 4-step loop: broad search → score → refine → repeat (max 3 cycles).
> Combine with `context-minify` skill for minimal token usage.

## When to Apply

| Condition                       | Apply?               |
| ------------------------------- | -------------------- |
| < 30 files or known target file | No — read directly   |
| 30-100 files, unknown target    | Yes — 1-2 cycles     |
| > 100 files, unknown target     | Yes — up to 3 cycles |

## The 4 Steps

### Step 1: DISPATCH — Broad Search

Goal: collect 5-10 **candidate** files without reading full content.

- `grep_search` — primary keywords (function name, error message, module)
- `find_by_name` — file patterns (_.service._, _.controller._)
- `view_file_outline` — scan structure of large files (> 200 lines)

**Rule:** Outline/path only. Do NOT read full files yet.

### Step 2: EVALUATE — Score Candidates

| Score   | Level                                       | Action                       |
| ------- | ------------------------------------------- | ---------------------------- |
| 0.8+    | **HIGH** — directly implements target logic | READ (minify if > 200 lines) |
| 0.5-0.7 | **MEDIUM** — related types/interfaces       | Note path, read if needed    |
| < 0.5   | **LOW** — tangentially related              | SKIP                         |

**Sufficient context:** ≥ 3 HIGH files + no critical gaps.

### Step 3: REFINE — Narrow Down

From HIGH files already read, extract new search terms:

- Import paths → find source files
- Class/function names → exact grep
- Config keys → find config files
- Exclude: confirmed irrelevant paths, test files (unless debugging tests), generated files

### Step 4: LOOP or PROCEED

- **Sufficient** (≥ 3 HIGH, no gaps) → PROCEED to code/debug
- **Insufficient** (cycle < 3) → Back to Step 1 with new keywords
- **3 cycles exhausted** → PROCEED with best available, note gaps, ask user if critical

## Context Minify Integration

For HIGH files > 200 lines, prefer minified read:

```bash
run_command("python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py <file>")
# Exception: read raw when editing (need line numbers), config files, or files < 50 lines
```

## Anti-Patterns

- Read 10 full files before thinking
- Grep 1 keyword and conclude
- Read test files before source files
- Skip EVALUATE — read every candidate
