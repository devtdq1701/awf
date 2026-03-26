---
name: standard-workflows
description: Global collection of standard workflows (Audit, Code, Deploy, etc.). Use this skill to install these workflows into any project.
---

# Standard Workflows Skill

Bộ sưu tập các workflows chuẩn cho Antigravity Vibe Coding Suite.

## Overview

Skill này chứa các workflows đã được chuẩn hóa để tái sử dụng giữa các dự án.

## Available Workflows

| Slash Command        | File                   | Description                     |
| -------------------- | ---------------------- | ------------------------------- |
| `/audit`             | `audit.md`             | 🏥 Code Doctor (Health Check)   |
| `/code`              | `code.md`              | 💻 Viết code theo Spec          |
| `/deploy`            | `deploy.md`            | 🚀 Deploy Production (SEO, SSL) |
| `/run`               | `run.md`               | ▶️ Application Launcher         |
| `/save-brain`        | `save_brain.md`        | 💾 Lưu kiến thức dự án          |
| `/test`              | `test.md`              | ✅ Chạy kiểm thử                |
| `/visualize`         | `visualize.md`         | 🎨 Thiết kế giao diện           |
| `/cloudflare-tunnel` | `cloudflare-tunnel.md` | 🌐 Quản lý Tunnel               |

## Usage

### Install Workflows

Để cài đặt các workflows vào dự án hiện tại:

```bash
python3 ~/.gemini/skills/standard-workflows/scripts/install.py
```

Lệnh này sẽ copy các file `.md` vào `.agent/workflows/` của workspace hiện tại.

### Manual Usage

Bạn cũng có thể tham khảo trực tiếp các file trong `assets/`:

```bash
ls ~/.gemini/skills/standard-workflows/assets/
```
