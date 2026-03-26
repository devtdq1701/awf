---
description: TDD Development Cycle - Test-Driven Development Workflow
---

# TDD Workflow

> Quy trình Test-Driven Development cho mọi feature implementation

---

## 🎯 Khi Nào Sử Dụng

- ✅ Implement feature mới
- ✅ Fix bug
- ✅ Refactor code
- ✅ Mọi code change

---

## 📋 Workflow Steps

### Step 1: Understand Requirements

```bash
# Đọc requirements từ Business Analyst
# Hiểu rõ expected behavior
# Identify edge cases
```

### Step 2: RED Phase - Write Failing Test

```bash
# Create test file
touch src/services/__tests__/user-service.test.ts

# Write test describing expected behavior
```

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { UserService } from "../user-service";

describe("UserService", () => {
  it("should create user with valid email", async () => {
    // Arrange
    const service = new UserService();
    const userData = { name: "Test", email: "test@test.com" };

    // Act
    const user = await service.createUser(userData);

    // Assert
    expect(user).toBeDefined();
    expect(user.email).toBe("test@test.com");
  });
});
```

```bash
// turbo
# Run test - MUST FAIL
pnpm test src/services/__tests__/user-service.test.ts
```

**Verify:**

- ❌ Test fails
- ❌ Fails for RIGHT reason (not syntax error)

### Step 3: GREEN Phase - Write Minimum Code

```bash
# Create implementation file
touch src/services/user-service.ts
```

**Example:**

```typescript
export class UserService {
  async createUser(data: { name: string; email: string }) {
    // Simplest implementation to pass test
    return {
      id: "1",
      name: data.name,
      email: data.email,
    };
  }
}
```

```bash
// turbo
# Run test - MUST PASS
pnpm test src/services/__tests__/user-service.test.ts
```

**Verify:**

- ✅ Test passes
- ✅ Only wrote minimum code

### Step 4: REFACTOR Phase - Improve Quality

```typescript
// Improve code quality while keeping tests green
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export class UserService {
  constructor(private db: Database) {}

  async createUser(data: unknown) {
    // Validate
    const validated = userSchema.parse(data);

    // Save to database
    const [user] = await this.db.insert(users).values(validated).returning();

    return user;
  }
}
```

```bash
// turbo
# Run test - MUST STILL PASS
pnpm test src/services/__tests__/user-service.test.ts
```

**Verify:**

- ✅ Tests still pass
- ✅ Code quality improved

### Step 5: Add Edge Case Tests

```typescript
describe('UserService', () => {
  it('should create user with valid email', async () => { ... });

  it('should reject invalid email', async () => {
    const service = new UserService();
    await expect(
      service.createUser({ name: 'Test', email: 'invalid' })
    ).rejects.toThrow();
  });

  it('should reject empty name', async () => {
    const service = new UserService();
    await expect(
      service.createUser({ name: '', email: 'test@test.com' })
    ).rejects.toThrow();
  });
});
```

```bash
// turbo
# Run all tests
pnpm test
```

### Step 6: Run Quality Gates

```bash
// turbo
# Type check
pnpm typecheck

// turbo
# Lint
pnpm lint

// turbo
# Test with coverage
pnpm test --coverage

// turbo
# Build
pnpm build
```

**Verify:**

- ✅ All gates pass
- ✅ Coverage ≥ 80%

### Step 7: Commit

```bash
git add .
git commit -m "feat(user): add user creation with validation"
```

---

## ⚠️ Important Rules

1. **NEVER write code before test**
2. **Test MUST fail first** (RED)
3. **Write MINIMUM code** to pass (GREEN)
4. **Refactor ONLY when green** (REFACTOR)
5. **Run ALL tests** before commit

---

## 🔗 Related

- [TDD Guide](../../docs/tdd-guide.md)
- [QA Engineer Agent](../agents/qa-engineer.md)
- [Fullstack Developer Agent](../agents/fullstack-developer.md)
