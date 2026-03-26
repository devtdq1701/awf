---
name: python-patterns
description: "Python development patterns. Type hints, error handling, concurrency (Thread/Process/Async), decorators, generators, dataclasses, performance. Keywords: python, type hint, async, threading, decorator, generator."
---

# Python Patterns

## Core Principles

- **Readability counts** — clear names, obvious logic
- **Explicit > implicit** — no magic, no hidden side effects
- **EAFP** — try/except over pre-checking conditions

## Type Hints (3.9+)

```python
def process(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

def find_user(uid: str) -> User | None:  # 3.10+ union syntax
    ...
```

### Protocol (Structural Typing)

```python
from typing import Protocol

class Renderable(Protocol):
    def render(self) -> str: ...

def render_all(items: list[Renderable]) -> str:
    return "\n".join(item.render() for item in items)
```

## Error Handling

```python
# Specific exceptions + chaining
def load_config(path: str) -> Config:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except FileNotFoundError as e:
        raise ConfigError(f"Not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid JSON: {path}") from e
```

### Exception Hierarchy

```python
class AppError(Exception): ...
class ValidationError(AppError): ...
class NotFoundError(AppError): ...
```

## Context Managers

```python
from contextlib import contextmanager

@contextmanager
def managed_resource(name: str):
    res = acquire(name)
    try:
        yield res
    finally:
        res.release()
```

## Decorators

```python
import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

def retry(attempts: int = 3, delay: float = 1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(1, attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if i == attempts: raise
                    time.sleep(delay * i)
        return wrapper
    return decorator
```

## Concurrency

| Model                 | Use Case                   | GIL                 |
| --------------------- | -------------------------- | ------------------- |
| `ThreadPoolExecutor`  | I/O-bound (HTTP, file, DB) | Released during I/O |
| `ProcessPoolExecutor` | CPU-bound (computation)    | Bypassed            |
| `asyncio`             | High-volume concurrent I/O | Single-thread coop  |

### Threading (I/O)

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_all(urls: list[str]) -> dict[str, str]:
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = {pool.submit(fetch_url, u): u for u in urls}
        return {futures[f]: f.result() for f in as_completed(futures)}
```

### Multiprocessing (CPU)

```python
from concurrent.futures import ProcessPoolExecutor

def process_all(datasets: list[list[int]]) -> list[int]:
    with ProcessPoolExecutor() as pool:
        return list(pool.map(compute, datasets))
```

### Async

```python
import asyncio, aiohttp

async def fetch_all(urls: list[str]) -> dict[str, str]:
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(u) for u in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return dict(zip(urls, [r.text() if not isinstance(r, Exception) else str(r) for r in responses]))
```

## Data Classes

```python
from dataclasses import dataclass, field

@dataclass
class ServerConfig:
    host: str
    port: int = 8080
    tags: list[str] = field(default_factory=list)

@dataclass(frozen=True)  # Immutable
class Point:
    x: float
    y: float
```

## Generators

```python
# Lazy: yields one line at a time, no full file in memory
def read_lines(path: str):
    with open(path) as f:
        for line in f:
            yield line.strip()
```

## Performance

| Pattern                           | Why                             |
| --------------------------------- | ------------------------------- |
| `__slots__ = ['x', 'y']`          | 40-50% less memory per instance |
| `"".join(gen)`                    | O(n) vs O(n²) string concat     |
| Generator over list comprehension | Memory-efficient for large data |

## Project Layout

```text
src/mypackage/
├── __init__.py
├── main.py
├── api/
├── models/
└── utils/
tests/
├── conftest.py
└── test_*.py
pyproject.toml
```

Import order: stdlib → third-party → local (use `isort`)

## Tooling

| Tool           | Purpose                        |
| -------------- | ------------------------------ |
| `black .`      | Formatter                      |
| `isort .`      | Import sorter                  |
| `ruff check .` | Linter (fast, replaces pylint) |
| `mypy .`       | Type checker                   |
| `pytest --cov` | Tests + coverage               |
| `bandit -r .`  | Security linter                |

## Anti-Patterns

| Bad                     | Good                           | Why                                 |
| ----------------------- | ------------------------------ | ----------------------------------- |
| `def f(x, items=[])`    | `items=None` then `items = []` | Mutable default shared across calls |
| `type(x) == list`       | `isinstance(x, list)`          | Supports inheritance                |
| `x == None`             | `x is None`                    | Identity check, not equality        |
| `from os.path import *` | `from os.path import join`     | Explicit imports                    |
| `except:` bare          | `except SpecificError as e:`   | Never swallow all exceptions        |
