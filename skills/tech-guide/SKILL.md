---
name: tech-guide
description: Create professional technical documentation including introduction, installation, configuration, and usage guides using standardized templates.
---

# Tech Guide Skill

This skill helps you generate comprehensive technical guides for tools and technologies. It provides a standardized template and automation to kickstart your documentation.

## Features

- **Standardized Template**: Includes sections for Introduction, Prerequisites, Installation, Configuration, and Usage.
- **Automation**: Quickly generate a guide skeleton for any tool.

## Usage

### Generate a New Guide

To create a new guide (e.g., for Prometheus):

```bash
python3 ~/.gemini/skills/tech-guide/scripts/create_guide.py "Prometheus"
```

This will create `prometheus-guide.md` in your current directory with the standard structure.

### Structure

- `assets/template.md`: The markdown template used for generation.
- `scripts/create_guide.py`: The Python script to generate the guide.
