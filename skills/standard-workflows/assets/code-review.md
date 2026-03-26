---
description: Code Review Checklist - Score-Based Approval Process
---

# Code Review Workflow

> Quy trình code review với score-based approval (≥ 9.5/10)

---

## 🎯 Khi Nào Sử Dụng

- ✅ Review Pull Request
- ✅ Pre-merge quality check
- ✅ Architecture evaluation

---

## 📋 Review Steps

### Step 1: Pre-Review Checks

```bash
// turbo
# Checkout PR branch
git fetch origin
git checkout pr-branch

// turbo
# Run quality gates
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

**Verify:**

- ✅ All quality gates pass
- ❌ If any fail → Request fixes before review

### Step 2: Code Quality Review

#### Universal Checklist

- [ ] Code follows naming conventions
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] No debugging code (console.log, print)
- [ ] Tests cover new functionality

#### TypeScript Specific

- [ ] No `any` types
- [ ] Proper async/await usage
- [ ] No unused imports/variables
- [ ] Proper null/undefined handling

#### Python Specific

- [ ] Type hints present
- [ ] No bare except clauses
- [ ] PEP 8 compliant
- [ ] Context managers for resources

### Step 3: Security Review

- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (proper escaping)
- [ ] Authentication verified
- [ ] Authorization checked
- [ ] No secrets in code

### Step 4: Performance Review

- [ ] No N+1 queries
- [ ] Proper database indexes
- [ ] Efficient algorithms
- [ ] Reasonable bundle size
- [ ] No memory leaks

### Step 5: Testing Review

```bash
// turbo
# Check coverage
pnpm test --coverage
```

- [ ] Coverage ≥ 80%
- [ ] Tests are readable
- [ ] Tests are isolated
- [ ] Edge cases covered
- [ ] No flaky tests

### Step 6: Architecture Review

- [ ] Follows SOLID principles
- [ ] Proper separation of concerns
- [ ] Low coupling, high cohesion
- [ ] Consistent with existing patterns
- [ ] No unnecessary complexity

---

## 📊 Scoring System

### Score Each Category (1-10)

| Category     | Weight | Score   | Notes                               |
| ------------ | ------ | ------- | ----------------------------------- |
| Code Quality | 25%    | \_\_/10 | Style, readability, maintainability |
| Security     | 25%    | \_\_/10 | Vulnerabilities, best practices     |
| Performance  | 20%    | \_\_/10 | Efficiency, optimization            |
| Testing      | 20%    | \_\_/10 | Coverage, quality                   |
| Architecture | 10%    | \_\_/10 | Design, patterns                    |

### Calculate Average

```
Average = (
  (Code Quality × 0.25) +
  (Security × 0.25) +
  (Performance × 0.20) +
  (Testing × 0.20) +
  (Architecture × 0.10)
)

Threshold: ≥ 9.5 to approve
```

---

## ✅ Approval Decision

### If Average ≥ 9.5

```markdown
## Code Review: [Feature Name]

### ✅ APPROVED

**Overall Score**: 9.6/10

### Scores

- Code Quality: 10/10
- Security: 9/10
- Performance: 10/10
- Testing: 9/10
- Architecture: 10/10

### Strengths

- Excellent test coverage (92%)
- Clean, readable code
- Proper error handling
- Good security practices

### Minor Suggestions (Optional)

1. Consider adding JSDoc for public API
2. Could extract magic numbers to constants

**Status**: Ready to merge ✅
```

### If Average < 9.5

````markdown
## Code Review: [Feature Name]

### ⚠️ NEEDS CHANGES

**Overall Score**: 8.2/10

### Scores

- Code Quality: 9/10
- Security: 7/10 ⚠️
- Performance: 8/10
- Testing: 7/10 ⚠️
- Architecture: 10/10

### Critical Issues (Must Fix)

#### 1. Security - Missing Input Validation

**File**: `src/api/users.ts:15`

```typescript
// ❌ Current
app.post("/users", async (c) => {
  const data = await c.req.json();
  return db.insert(users).values(data);
});

// ✅ Required
app.post("/users", zValidator("json", userSchema), async (c) => {
  const data = c.req.valid("json");
  return db.insert(users).values(data);
});
```
````

#### 2. Testing - Low Coverage

**Coverage**: 65% (requires 80%+)
**Missing tests**:

- Edge case: empty email
- Edge case: duplicate email
- Error handling paths

### Recommendations

1. Add input validation (Zod schema)
2. Increase test coverage to 80%+
3. Add error handling tests

**Status**: Needs changes before merge ❌

```

---

## 🔄 Re-Review Process

1. Developer fixes ALL issues
2. Developer requests re-review
3. Reviewer checks fixes
4. Re-calculate score
5. Repeat until score ≥ 9.5

---

## 💡 Review Tips

### Be Constructive
- ✅ "Consider using Zod for validation"
- ❌ "This code is bad"

### Be Specific
- ✅ "Add index on users.email for faster lookups"
- ❌ "Improve performance"

### Be Thorough
- Review all aspects
- Don't skip security
- Check test quality

### Be Pragmatic
- Balance ideal vs practical
- Consider deadlines
- But never compromise security

---

## 🔗 Related

- [Coding Standards](../../docs/coding-standards.md)
- [Quality Gates](../../docs/quality-gates.md)
- [Principal Engineer Agent](../agents/principal-engineer.md)
```
