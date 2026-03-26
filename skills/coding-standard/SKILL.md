---
name: coding-standard
description: "Coding style and best practices for Common, Bash, Python. Use when writing new code or refactoring. Keywords: YAGNI, DRY, KISS, naming, style, code smell, API format."
---

# Coding Standards

## Core Principles

- **YAGNI** — Don't build features before needed
- **KISS** — Simplest solution that works
- **DRY** — Extract common logic, no copy-paste
- **Readability > Clever** — Self-documenting names, consistent formatting
- Keep files in the right place. Separate mock/source. Remove redundant code

## Naming

| Context         | Convention                    | Example                                |
| --------------- | ----------------------------- | -------------------------------------- |
| Variables       | Descriptive, no abbreviations | `user_count`, `is_active`              |
| Functions       | Verb + Noun                   | `get_user_data()`, `calculate_total()` |
| Files (Python)  | `snake_case`                  | `user_service.py`                      |
| Files (JS/Bash) | `kebab-case`                  | `build-config.sh`                      |

## Code Smells

### Long Functions (>30 lines) → Split

```python
# Split into single-responsibility functions
def process_order(order):
    validated = validate_order(order)
    transformed = transform_order(validated)
    return save_order(transformed)
```

### Deep Nesting (>3 levels) → Early Returns

```python
if not user: return
if not user.is_admin: return
if not market.is_active: return
# proceed with logic
```

### Magic Numbers → Named Constants

```python
MAX_RETRIES = 3
RETRY_DELAY_MS = 500
```

## Immutability

```python
# Prefer creating new objects over mutation
updated_user = {**user, "name": "New Name"}
updated_items = [*items, new_item]
```

## Parallel Execution

```python
# BAD: sequential when tasks are independent
users = await fetch_users()
markets = await fetch_markets()

# GOOD: parallel
users, markets = await asyncio.gather(fetch_users(), fetch_markets())
```

## API Response Format

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "total": 100, "page": 1, "limit": 10 }
}
```

Input validation with Pydantic:

```python
class CreateOrderRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    quantity: int = Field(gt=0)
    tags: list[str] = Field(default_factory=list)
```

## Language Guides

### Bash

Reference: [references/bash-standard.md](references/bash-standard.md)

- Shebang: `#!/usr/bin/env bash`
- Strict mode: `set -euo pipefail`
- Always quote variables: `"$variable"`

### Python

Reference: [references/python-standard.md](references/python-standard.md)

- Follow PEP8, type hints required for signatures, docstrings for public APIs

## Tools

- `scripts/format_python.py` — Format Python code
- `scripts/check_bash.sh` — Validate Bash (requires shellcheck)
