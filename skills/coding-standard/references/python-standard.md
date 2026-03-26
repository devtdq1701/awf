# Python Standards

## 1. Style Guide (PEP 8)

### Formatting

- **Indent**: 4 spaces (không dùng tabs)
- **Line Length**: Max 88 chars (theo Black formatter)
- **Imports**:
  1. Standard library
  2. Third-party
  3. Local application
     (Separate groups by blank line)

### Naming

- `snake_case`: Variables, functions, methods, modules
- `PascalCase`: Classes, Exceptions
- `UPPER_CASE`: Constants

## 2. Modern Python

### Type Hinting

Bắt buộc cho function signatures:

```python
def process_data(data: dict[str, Any], retries: int = 3) -> bool:
    ...
```

### f-strings

Ưu tiên f-strings hơn `.format()` hoặc `%`:

```python
# ✅ Good
print(f"User: {name}, ID: {user_id}")

# ❌ Avoid
print("User: %s, ID: %s" % (name, user_id))
```

### Pathlib

Ưu tiên `pathlib` hơn `os.path`:

```python
from pathlib import Path

# ✅ Good
path = Path("data") / "file.txt"
text = path.read_text()

# ❌ Avoid
path = os.path.join("data", "file.txt")
```

## 3. Documentation

### Google Style Docstrings

Bắt buộc cho modules, classes, public methods:

```python
def fetch_user(user_id: int) -> dict:
    """Fetch user data from API.

    Args:
        user_id: The unique ID of the user.

    Returns:
        A dictionary containing user details.

    Raises:
        UserNotFoundError: If user does not exist.
    """
```

## 4. Best Practices

- **Explicit is better than implicit**
- **Exceptions**: Catch specific exceptions, không dùng bare `except:`
- **Context Managers**: Dùng `with` statement cho I/O management
