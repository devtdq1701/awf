---
description: 💾 Backup cấu hình ~/.gemini lên GitHub
---

# WORKFLOW: /backup-gemini

Backup `~/.gemini` lên GitHub repo. Configure your backup repo in `~/.gemini/skills/gemini-backup/SKILL.md`.

---

## Prerequisite

```
view_file: ~/.gemini/skills/gemini-backup/SKILL.md
```

Follow SKILL.md **Backup** section exactly.

---

## Step 1: Run backup script

Ask user for a short description, or auto-generate from recent session context.

// turbo

```bash
bash ~/.gemini/skills/gemini-backup/scripts/backup.sh "<description>"
```

> Save the changelog block from script output for Step 3.

## Step 2: Verify backup

Use GitHub MCP to confirm push succeeded:

```
mcp_github-mcp-server_get_file_contents(owner=<YOUR_GITHUB_USER>, repo=<YOUR_BACKUP_REPO>, path=README.md)
```

## Step 3: Update changelog in README.md

// turbo

```bash
cd /tmp && rm -rf dotgemini-backup-readme
git clone --depth 1 git@github.com:<YOUR_GITHUB_USER>/<YOUR_BACKUP_REPO>.git dotgemini-backup-readme
```

Insert new changelog entry after `## Changelog` line in README.md, then:

// turbo

```bash
cd /tmp/dotgemini-backup-readme && git add README.md && git commit -m "docs: add changelog entry" && git push origin main
cd /tmp && rm -rf dotgemini-backup-readme
```

## Step 4: Report

| Field     | Value                |
| --------- | -------------------- |
| Repo      | Link to GitHub repo  |
| Commit    | SHA from Step 1      |
| Files     | Count from git diff  |
| Stats     | Insertions/deletions |
| Changelog | Confirmed updated    |

---

## NEXT STEPS:

```
1. /save_brain — Lưu knowledge từ session
2. /restore-gemini — Khôi phục cấu hình từ backup
```
