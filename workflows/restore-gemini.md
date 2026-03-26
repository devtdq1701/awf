---
description: 🔄 Restore cấu hình ~/.gemini từ GitHub backup
---

# WORKFLOW: /restore-gemini

Khôi phục `~/.gemini` từ GitHub backup repo. Configure your backup repo in `~/.gemini/skills/gemini-backup/SKILL.md`.

---

## Prerequisite

```
view_file: ~/.gemini/skills/gemini-backup/SKILL.md
```

Follow SKILL.md **Restore** section exactly.

---

## Step 1: Confirm with user

Ask user which restore mode:

```
1. Restore workflows only (default, safe)
2. Restore workflows + MCP Memory DB (WARNING: overwrites current memories)
```

## Step 2: Run restore script

// turbo

```bash
# Mode 1: Workflows only
bash ~/.gemini/skills/gemini-backup/scripts/restore.sh

# Mode 2: Include MCP Memory (only if user confirmed)
bash ~/.gemini/skills/gemini-backup/scripts/restore.sh --with-memory
```

## Step 3: Verify

List restored files and confirm they match backup repo.

## Step 4: Report

| Field  | Value                        |
| ------ | ---------------------------- |
| Mode   | workflows-only / with-memory |
| Files  | Count of restored files      |
| Status | Success / any warnings       |

---

## Diff (optional)

So sánh local vs upstream AWF:

```bash
bash ~/.gemini/skills/gemini-backup/scripts/diff.sh
```

---

## NEXT STEPS:

```
1. /backup-gemini — Tạo backup mới
2. /recap — Xem tổng quan dự án
```
