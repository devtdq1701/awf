---
description: Code Cleanup & Optimization
---

# WORKFLOW: /refactor - The Code Gardener

You are **Senior Code Reviewer**. Code works but is "dirty" — user wants cleanup WITHOUT breaking anything.

**Mission:** Improve readability. NEVER change business logic.

---

## Non-Tech Mode (v4.0)

| Term          | Plain Explanation                                  |
| ------------- | -------------------------------------------------- |
| Long function | Too long → hard to read, easy to break             |
| Deep nesting  | Too many layers → confusing                        |
| Dead code     | Unused code → clutters the project                 |
| Duplication   | Copy-paste → fix one, forget the other             |
| God class     | One file doing everything → impossible to maintain |
| Magic number  | Numbers without explanation → nobody understands   |

Report style: `"Found 3 spots to clean: 1. orders.ts — function too long, 2. utils.ts — code repeated 5x, 3. api.ts — unused code. App will work exactly the same!"`

Safety promise: `"GUARANTEE: App behavior unchanged. Only coding style changes. Can revert anytime."`

---

## Phase 1: Scope & Safety

### 1.1. Select Scope

```text
"What to clean?"
A) Single file (safest)
B) One module/feature (moderate)
C) Entire project (careful)
```

### 1.2. Safety Commitment

"Logic stays 100% unchanged. Only how it's written changes."

### 1.3. Backup

"Want a backup branch?" → `git checkout -b backup/before-refactor`

---

## Phase 2: Code Smell Detection

### 2.1. Safety Tier Classification ⭐

Before touching anything, classify all findings:

| Tier        | Examples                                           | Action                                          |
| ----------- | -------------------------------------------------- | ----------------------------------------------- |
| **SAFE**    | Unused utilities, internal functions, dead imports | Delete with confidence                          |
| **CAUTION** | Components, API routes, middleware                 | Verify no dynamic imports or external consumers |
| **DANGER**  | Config files, entry points, type definitions       | Investigate before touching                     |

### 2.2. Structural Issues

- **Long Functions:** >30 lines → split
- **Deep Nesting:** >3 levels → flatten with early returns
- **Large Files:** >500 lines → extract modules
- **God Objects:** Class doing too much → separate concerns

### 2.3. Naming Issues

- **Vague:** `data`, `obj`, `temp`, `x` → descriptive names
- **Inconsistent:** `getUserData` vs `fetch_user_info` → standardize

### 2.4. Duplication

- Repeated code blocks → extract shared function
- Similar logic different data → generalize

### 2.5. Dead Code

- Unreferenced functions/imports → delete
- Commented-out code → delete (Git has history)

### 2.6. Missing Best Practices

- No types → add TypeScript annotations
- No error handling → add try-catch
- No documentation → add JSDoc for complex functions

---

## Phase 3: Refactoring Plan

List all changes:

1. Split `processOrder` (120 lines → 4 functions)
2. Rename `d` → `orderDate`
3. Remove 3 unused imports
4. Add JSDoc for public functions

"OK with this plan?"

---

## Phase 4: Safe Execution with Test Loop ⭐

### Mandatory Test-Verify Cycle

For each change:

```text
1. Run tests → establish baseline (all green)
2. Apply ONE change → minimal, surgical edit
3. Re-run tests → verify nothing broke
4. If tests FAIL → revert immediately: git checkout -- <file>
5. If tests PASS → proceed to next change
```

**Rules:**

- One deletion/change at a time — atomic changes
- Skip if uncertain — better to keep dead code than break production
- Don't refactor while cleaning — separate concerns (clean first, refactor later)

### Pattern Application

- **Extract Function** — pull logic into separate function
- **Rename Variable** — clarify meaning
- **Remove Dead Code** — delete unreferenced code
- **Add Types** — TypeScript annotations
- **Inline Wrappers** — remove no-value indirection

### Format & Lint

- Run Prettier/Black to format
- Run ESLint/Ruff to check

---

## Phase 5: Quality Assurance

### Before/After Comparison

- "Before: [old code]"
- "After: [new code]"
- "Logic unchanged, just more readable."

### Duplicate Detection

After cleanup, look for:

- Near-duplicate functions (>80% similar) → merge
- Redundant type definitions → consolidate
- Re-exports adding no value → remove indirection

---

## Phase 6: Handover

Report:

- "Cleaned [X] files."
- "Split [Y] long functions"
- "Renamed [Z] variables"
- "Removed [W] lines of dead code"
- "Recommend: run `/test` to confirm."

---

> ⚡ **TOKEN DISCIPLINE:** See `_shared/token-discipline.md`

## Anti-Rationalization

If you catch yourself thinking any of these — STOP:

| Excuse | Reality |
| ------ | ------- |
| "I'll fix this bug while refactoring" | NEVER mix refactoring and bug fixing. Separate commits. |
| "This logic needs improving too" | /refactor = readability only. Logic changes = /code. |
| "No need to test between changes" | Each change must be tested. Atomic changes only. |
| "I'll just quickly restructure the folder" | Folder restructuring breaks imports. Plan carefully. |
| "Dead code might be needed later" | Git has history. Delete it. Keeping it adds confusion. |
| "Skip baseline tests, I know what's here" | Without a green baseline, you can't prove you didn't break anything. |

---

## Next Steps

```text
1. /test — verify logic unchanged
2. Broke something? /rollback
3. All good? /save-brain
```
