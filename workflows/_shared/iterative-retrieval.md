# Iterative Retrieval — Find the Right Context

> DON'T read all files. Use a 4-step loop: broad search → score → refine → repeat (max 3 cycles).
> Use `vfs_search` for code navigation, then `view_file` with targeted line ranges.

## When to Apply

| Condition                       | Apply?               |
| ------------------------------- | -------------------- |
| < 30 files or known target file | No — read directly   |
| 30-100 files, unknown target    | Yes — 1-2 cycles     |
| > 100 files, unknown target     | Yes — up to 3 cycles |

## The 4 Steps

### Step 1: DISPATCH — Broad Search

Goal: collect 5-10 **candidate** files without reading full content.

- `vfs_search` — find function/class/type definitions by name (preferred for code)
- `grep_search` — primary keywords (error message, config key, string literal)
- `find_by_name` — file patterns (_.service._, _.controller._)

**Rule:** Signatures/path only. Do NOT read full files yet.

### Step 2: EVALUATE — Score Candidates

| Score   | Level                                       | Action                                  |
| ------- | ------------------------------------------- | --------------------------------------- |
| 0.8+    | **HIGH** — directly implements target logic | READ with targeted line range from vfs  |
| 0.5-0.7 | **MEDIUM** — related types/interfaces       | Note path, read if needed               |
| < 0.5   | **LOW** — tangentially related              | SKIP                                    |

**Sufficient context:** ≥ 3 HIGH files + no critical gaps.

### Step 3: REFINE — Narrow Down

From HIGH files already read, extract new search terms:

- Import paths → find source files
- Class/function names → exact grep or vfs_search
- Config keys → find config files
- Exclude: confirmed irrelevant paths, test files (unless debugging tests), generated files

### Step 4: LOOP or PROCEED

- **Sufficient** (≥ 3 HIGH, no gaps) → PROCEED to code/debug
- **Insufficient** (cycle < 3) → Back to Step 1 with new keywords
- **3 cycles exhausted** → PROCEED with best available, note gaps, ask user if critical

## Large File Strategy

For HIGH files > 200 lines, use vfs to pinpoint then read only what's needed:

```
1. vfs_search(pattern, [path])    → get file + line number
2. view_file(file, start, end)    → read only the relevant range
3. vfs_extract([path])            → get full API surface (signatures only)
```

## Anti-Patterns

- Read 10 full files before thinking
- Grep 1 keyword and conclude
- Read test files before source files
- Skip EVALUATE — read every candidate
