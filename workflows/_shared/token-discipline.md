# Token Discipline

> Apply to ALL workflows when reading code or producing output.

## Reading Files

**Large files (> 200 lines) for understanding:**

```
# Use vfs to find definitions, then read targeted ranges
vfs_search(pattern, [path])       → get file + line number
view_file(file, start, end)       → read only the relevant range
vfs_extract([path])               → get full API surface (signatures only)
```

**Multiple files:** use vfs_extract to scan API surface first, then read only what's needed:

```
vfs_extract(["src/"])             → compact signatures of all exports
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
