---
description: Run test suite and analyze results
argument-hint: "[--e2e|--unit|--all|--visual]"
allowed-tools:
  - Bash(npm run *)
  - Bash(npx *)
  - Read
---

# Run Tests Command

Run appropriate test suite and provide analysis.

## Process

### 1. Parse Arguments

```
$ARGUMENTS options:
- --e2e    : Playwright E2E tests only
- --unit   : Vitest unit tests only
- --visual : Visual regression tests only
- --all    : All tests (default)
- (empty)  : All tests
```

### 2. Execute Tests

```bash
# Based on argument:

# --unit
npm run test

# --e2e
npx playwright test

# --visual
npx playwright test --grep visual

# --all (default)
npm run test && npx playwright test
```

### 3. Analyze Results

If tests pass:
```markdown
## Test Results ✅

**Unit Tests:** X passed
**E2E Tests:** Y passed
**Visual Regression:** Z passed

All tests passing. Ready for commit.
```

If tests fail:
```markdown
## Test Results ❌

**Failing Tests:**

### [Test Name]
- **File:** [path]
- **Error:** [error message]
- **Root Cause:** [analysis]
- **Suggested Fix:** [recommendation]

### Summary
- Total: X tests
- Passed: Y
- Failed: Z

**Recommended Actions:**
1. [Action 1]
2. [Action 2]
```

### 4. Coverage Summary (if available)

```markdown
## Coverage Report

| Category | Coverage |
|----------|----------|
| Statements | X% |
| Branches | Y% |
| Functions | Z% |
| Lines | W% |

**Uncovered Areas:**
- [file.ts:line] - [description]
```

## Common Failure Patterns

### TypeScript Errors
```
Error: Type 'X' is not assignable to type 'Y'
→ Check type definitions, may need Zod schema update
```

### Playwright Timeout
```
Error: Timeout 30000ms exceeded
→ Check for slow loading, add waitForLoadState
→ Consider masking dynamic content
```

### Visual Regression Diff
```
Error: Screenshot comparison failed
→ Intentional change? Run: npx playwright test --update-snapshots
→ Unintentional? Check CSS changes
```

### Missing Element
```
Error: Locator not found
→ Check data-testid attribute exists
→ Verify element renders at test viewport
```

## RedWhiteReno Specific

- Test on mobile viewport (375px) first
- Verify touch targets >= 44x44px
- Check CTAs in thumb zone
- Validate AI output tests include fallback scenarios
