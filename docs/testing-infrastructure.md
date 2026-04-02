# Testing Infrastructure Guide
### Supplement to docs/ - Testing Pipeline Documentation

This document provides comprehensive guidance on the testing infrastructure, patterns, and workflows established in this project. It supplements the existing documentation in `docs/` with practical testing implementation details.

---

## 1. Testing Stack

The project uses the following testing stack as defined in `docs/backend-architecture-framework.md`:

| Technology | Purpose | Configuration |
|------------|---------|---------------|
| **Bun** | Package manager and test runner | `bun test` |
| **Jest** | Testing framework | `jest.config.js` |
| **ts-jest** | TypeScript support | Bundled with Jest |

### Installation (Already Completed)

```bash
# Install dependencies
bun install

# Run tests
bun test
```

---

## 2. Project Test Structure

Tests follow the structure outlined in `docs/project-structure-blueprint.md`:

```
src/
├── __tests__/              # Test files
│   ├── services/          # Service layer tests
│   │   ├── flowService.test.ts
│   │   └── verificationService.test.ts
│   ├── hooks/            # Hook tests (future)
│   ├── components/       # Component tests (future)
│   └── utils/           # Utility tests (future)
```

### Test File Naming Convention

Per `docs/ai-code-discipline.md`:

- Test files must match pattern: `{filename}.test.ts`
- Colocate tests with source files in `__tests__/` subdirectory
- Use descriptive test names: `describe('functionName')`

---

## 3. Configuration Files

### jest.config.js

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
}

module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js

```javascript
// Jest setup file
// Import jest-dom for extended assertions
require('@testing-library/jest-dom')
```

### tsconfig.json (Test Support)

```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

---

## 4. Writing Tests

### Service Layer Tests

Per `docs/backend-architecture-framework.md`, services must be tested for business logic:

```typescript
import { functionToTest } from '@/services/serviceName'

describe('serviceName', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('functionName', () => {
    it('should perform expected behavior', async () => {
      // Arrange
      const input = 'test-input'
      
      // Act
      const result = await functionToTest(input)
      
      // Assert
      expect(result).toBeDefined()
    })
  })
})
```

### Test Organization Pattern

Follow this structure per `docs/ai-dev-workflow.md`:

1. **Describe blocks** - Group related tests by function/method
2. **BeforeEach** - Reset state between tests
3. **It/Test blocks** - Individual test cases
4. **Arrange-Act-Assert** - Clear test structure

---

## 5. Running Tests

### Available Commands

```bash
# Run all tests
bun test

# Run specific test file
bun test src/__tests__/services/flowService.test.ts

# Run tests in watch mode (development)
bun test --watch

# Run tests with coverage
bun test --coverage

# Run tests matching pattern
bun test --testNamePattern="validateTransition"
```

### Test Output

```
bun test v1.3.9

src/__tests__/services/verificationService.test.ts:
  (pass) verificationService > generateVerificationCode > should generate a unique verification code [501.96ms]
  ...

42 pass
0 fail
80 expect() calls
Ran 42 tests across 2 files. [9.44s]
```

---

## 6. Current Test Coverage

### Implemented Tests

| Service | Tests | Status |
|---------|-------|--------|
| `flowService` | 26 | ✅ Passing |
| `verificationService` | 16 | ✅ Passing |
| **Total** | **42** | ✅ All Passing |

### flowService Test Cases

- `validateTransition` - 7 tests
- `checkPrerequisites` - 4 tests
- `getAllowedTransitions` - 3 tests
- `getStageProgress` - 2 tests
- `calculateFlowCompletion` - 3 tests
- `getRemainingStages` - 2 tests
- `requiresVerification` - 4 tests
- `getFlowSummary` - 1 test

### verificationService Test Cases

- `generateVerificationCode` - 4 tests
- `validateVerificationCode` - 4 tests
- `useVerificationCode` - 2 tests
- `getVerificationSummary` - 2 tests
- `revokeVerificationCode` - 2 tests
- `canAccessInterview` - 2 tests

---

## 7. Testing Best Practices

### Per docs/ai-code-discipline.md

1. **Test Intent, Not Implementation**
   - Test behavior, not internal structure
   - Focus on public interfaces

2. **Keep Tests Independent**
   - Each test should run in isolation
   - Use `beforeEach` to reset state

3. **Use Descriptive Names**
   ```typescript
   // Bad
   it('test1', () => {})
   
   // Good
   it('should return valid transition for forward progression', () => {})
   ```

4. **Follow AAA Pattern**
   - **Arrange** - Set up test data
   - **Act** - Execute the function
   - **Assert** - Verify the result

### Per docs/component-design-rules.md

- Components must be **easy to test**
- Avoid **hidden state logic**
- Prefer **clear props** and **explicit events**

---

## 8. CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun test
      
      - name: Run with coverage
        run: bun test --coverage
```

---

## 9. Adding New Tests

### Step 1: Create Test File

```
src/__tests__/services/newService.test.ts
```

### Step 2: Import Dependencies

```typescript
import { functionToTest } from '@/services/newService'
import type { SomeType } from '@/types/someType'
```

### Step 3: Write Tests

Follow the patterns in existing test files:
- Group by function/method
- Test success and error cases
- Cover edge cases

### Step 4: Run Tests

```bash
bun test src/__tests__/services/newService.test.ts
```

---

## 10. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Module not found | Check `moduleNameMapper` in `jest.config.js` |
| TypeScript errors | Verify `tsconfig.json` includes jest types |
| Mock issues | Use `jest.clearAllMocks()` in beforeEach |
| Async test failures | Ensure proper async/await usage |

### Debugging Tests

```bash
# Run with verbose output
bun test --verbose

# Run only failed tests
bun test --onlyFailures

# Debug specific test
bun test --inspect-brk
```

---

## 11. Related Documentation

For more details, see:

- `docs/backend-architecture-framework.md` - Testing architecture
- `docs/backend-request-lifecycle.md` - Testing lifecycle
- `docs/ai-code-discipline.md` - Code quality rules
- `docs/ai-dev-workflow.md` - Development workflow
- `docs/production-deployment.md` - CI/CD integration

---

## 12. Future Enhancements

### Planned Test Coverage

| Area | Priority | Status |
|------|----------|--------|
| Hook tests | High | Not started |
| Component tests | High | Not started |
| Integration tests | Medium | Not started |
| E2E tests | Medium | Not started |
| API route tests | Medium | Not started |

### Adding Hook Tests

```typescript
// src/__tests__/hooks/useExample.test.ts
import { renderHook, act } from '@testing-library/react'
import { useExample } from '@/hooks/useExample'

describe('useExample', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useExample())
    expect(result.current.data).toBeNull()
  })
})
```

### Adding Component Tests

```typescript
// src/__tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

---

## Summary

This testing infrastructure provides:

- ✅ **42 passing tests** across 2 services
- ✅ **TypeScript support** with full type safety
- ✅ **Bun test runner** for fast execution
- ✅ **Jest framework** for assertions and mocking
- ✅ **Clear patterns** aligned with docs/

Run tests with: `bun test`
