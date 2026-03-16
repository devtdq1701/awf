# Token Discipline

> Apply to ALL workflows when reading code or producing output.

## Reading Files

**Large files (> 200 lines) for understanding:**

```bash
# Prefer minified read
run_command("python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py <file>")
# Exceptions: file needs editing (exact line numbers), config files (already compact), files < 50 lines
```

**Multiple files:** scan stats first, then read only what's needed:

```bash
run_command("python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py src/ --ext py --stats-only")
```

## Output Rules

| Rule                | Description                                     |
| ------------------- | ----------------------------------------------- |
| **Concise**         | ≤ 5 lines per step/task report                  |
| **No repeat**       | Don't restate known context                     |
| **Pass paths**      | Reference file paths instead of copying content |
| **Bullets > prose** | Use bullet points, not paragraphs               |
| **WHAT not WHY**    | State what to do, not why (unless user asks)    |

## Scope Rules

- **One thing at a time** — don't fix unrelated code
- **Minimal changes** — edit only the exact spot requested
- **No unsolicited features** — if something seems needed, ASK first
