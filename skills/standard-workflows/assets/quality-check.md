---
description: Quality Check - Run All Quality Gates
---

# Quality Check Workflow

> Run tất cả quality gates trước khi commit

---

## 🎯 Khi Nào Sử Dụng

- ✅ Trước khi commit
- ✅ Trước khi push
- ✅ Trước khi tạo PR
- ✅ Daily quality check

---

## 📋 Quick Check

### TypeScript/JavaScript Projects

```bash
// turbo
# Full quality check
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

### Python Projects

```bash
// turbo
# Full quality check
mypy src/ && ruff check . && pytest --cov=src
```

---

## 📋 Detailed Steps

### Step 1: Type Check

**TypeScript:**

```bash
// turbo
pnpm typecheck
```

**Python:**

```bash
// turbo
mypy src/
```

**Expected:**

- ✅ Zero type errors
- ✅ No `any` types (TypeScript)
- ✅ All type hints present (Python)

**If Failed:**

```bash
# Fix type errors
# Re-run typecheck
```

---

### Step 2: Lint Check

**TypeScript:**

```bash
// turbo
pnpm lint
```

**Python:**

```bash
// turbo
ruff check .
```

**Expected:**

- ✅ Zero lint errors
- ✅ Zero warnings (strict mode)
- ✅ Consistent code style

**If Failed:**

```bash
# Auto-fix if possible
pnpm lint --fix  # TypeScript
ruff check --fix .  # Python

# Manual fix remaining issues
# Re-run lint
```

---

### Step 3: Test Check

**TypeScript:**

```bash
// turbo
pnpm test --coverage
```

**Python:**

```bash
// turbo
pytest --cov=src --cov-report=term
```

**Expected:**

- ✅ All tests pass
- ✅ Coverage ≥ 80%
- ✅ No skipped tests
- ✅ No flaky tests

**Coverage Requirements:**
| Metric | Minimum |
|--------|---------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

**If Failed:**

```bash
# Fix failing tests
# Add missing tests
# Re-run tests
```

---

### Step 4: Build Check

**TypeScript:**

```bash
// turbo
pnpm build
```

**Python:**

```bash
// turbo
python -c "import src; print('OK')"
```

**Expected:**

- ✅ Build succeeds
- ✅ No build warnings
- ✅ All assets generated

**If Failed:**

```bash
# Fix build errors
# Check dependencies
# Re-run build
```

---

## 📊 Quality Report

### Generate Report

```bash
# TypeScript
echo "=== Quality Report ==="
echo "Type Check: $(pnpm typecheck > /dev/null 2>&1 && echo '✅ PASS' || echo '❌ FAIL')"
echo "Lint: $(pnpm lint > /dev/null 2>&1 && echo '✅ PASS' || echo '❌ FAIL')"
echo "Tests: $(pnpm test > /dev/null 2>&1 && echo '✅ PASS' || echo '❌ FAIL')"
echo "Build: $(pnpm build > /dev/null 2>&1 && echo '✅ PASS' || echo '❌ FAIL')"
```

**Example Output:**

```
=== Quality Report ===
Type Check: ✅ PASS
Lint: ✅ PASS
Tests: ✅ PASS (Coverage: 87%)
Build: ✅ PASS
```

---

## 🚫 Common Issues

### Issue 1: Type Errors

```typescript
// ❌ Error
const user: User = fetchUser(); // Promise<User> ≠ User

// ✅ Fix
const user: User = await fetchUser();
```

### Issue 2: Lint Errors

```typescript
// ❌ Error: Unused variable
const unused = 123;

// ✅ Fix: Remove or use it
// (removed)
```

### Issue 3: Test Failures

```typescript
// ❌ Error: Test timeout
it("should fetch data", async () => {
  const data = await fetchData(); // No timeout
});

// ✅ Fix: Add timeout
it("should fetch data", async () => {
  const data = await fetchData();
}, 10000); // 10s timeout
```

### Issue 4: Build Errors

```typescript
// ❌ Error: Cannot find module
import { helper } from "./helper";

// ✅ Fix: Check file exists and path is correct
import { helper } from "./utils/helper";
```

---

## 🔧 Setup Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
set -e

echo "🔍 Running quality gates..."

# TypeScript/JavaScript
if [ -f "package.json" ]; then
  pnpm typecheck || exit 1
  pnpm lint || exit 1
  pnpm test || exit 1
  pnpm build || exit 1
fi

# Python
if [ -f "pyproject.toml" ]; then
  mypy src/ || exit 1
  ruff check . || exit 1
  pytest --cov=src || exit 1
fi

echo "✅ All quality gates passed!"
```

```bash
// turbo
chmod +x .git/hooks/pre-commit
```

---

## 💡 Tips

### 1. Run Locally First

Always run quality gates BEFORE pushing.

### 2. Fix Immediately

Don't accumulate issues.

### 3. Use Watch Mode

```bash
# TypeScript
pnpm test --watch

# Python
pytest --watch
```

### 4. Check Coverage Trends

```bash
# View coverage report
open coverage/index.html  # TypeScript
open htmlcov/index.html   # Python
```

### 5. Automate in CI/CD

Quality gates should run automatically on PR.

---

## 🔗 Related

- [Quality Gates](../../docs/quality-gates.md)
- [TDD Guide](../../docs/tdd-guide.md)
- [Coding Standards](../../docs/coding-standards.md)
