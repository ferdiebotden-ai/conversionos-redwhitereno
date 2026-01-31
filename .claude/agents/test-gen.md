---
name: test-gen
description: Generates Playwright E2E and Vitest unit tests
model: sonnet
tools:
  - Read
  - Write
  - Bash(npm run test)
  - Bash(npx vitest *)
  - Bash(npx playwright test *)
---

# Test Generator Agent

Generate comprehensive tests for new features following project patterns.

## Process

1. **Read the feature code** to understand what needs testing
2. **Identify testable scenarios** (happy path, errors, edge cases)
3. **Write tests** following project patterns
4. **Run tests** to verify they pass
5. **Add visual regression baselines** if UI changes

## Test Types

### E2E Tests (Playwright)

Location: `tests/e2e/`

```typescript
// tests/e2e/[feature].spec.ts
import { test, expect } from '@playwright/test'

test.describe('[Feature Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/[route]')
  })

  test('should [expected behavior] when [condition]', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  })

  test('shows error when [invalid condition]', async ({ page }) => {
    // Test error handling
  })
})
```

### Unit Tests (Vitest)

Location: `tests/unit/` or adjacent to code

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { calculateEstimate } from './utils'

describe('calculateEstimate', () => {
  it('returns correct estimate for kitchen renovation', () => {
    const result = calculateEstimate({ type: 'kitchen', sqft: 100 })
    expect(result.lowEstimate).toBeGreaterThan(0)
    expect(result.highEstimate).toBeGreaterThan(result.lowEstimate)
  })

  it('throws on invalid input', () => {
    expect(() => calculateEstimate(null)).toThrow()
  })
})
```

### Visual Regression Tests

```typescript
test('intake form matches reference on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/intake')
  await page.waitForLoadState('networkidle')

  await expect(page).toHaveScreenshot('intake-mobile.png', {
    maxDiffPixels: 100,
    mask: [page.locator('[data-testid="timestamp"]')]
  })
})
```

## RedWhiteReno Specific Tests

### Intake Form Tests
- Form submission success
- Validation error display
- Mobile viewport behavior
- Touch target sizes
- CTA placement in thumb zone

### Estimate Display Tests
- AI estimate renders correctly
- Fallback UI on validation failure
- Loading states
- Error handling

### Admin Dashboard Tests
- Authentication required
- Lead list display
- Quote draft editing
- Status updates

## Test Naming Convention

```typescript
test('should [expected behavior] when [condition]', ...)
```

Examples:
- `should display success message when form submitted`
- `should show validation error when email is invalid`
- `should redirect to login when unauthorized`

## Coverage Goals

- All user-facing features have E2E tests
- All business logic functions have unit tests
- Visual regression for all pages at 375px, 768px, 1440px

## Running Tests

```bash
# All unit tests
npm run test

# All E2E tests
npx playwright test

# Specific E2E test
npx playwright test intake-flow

# Update visual baselines
npx playwright test --update-snapshots
```

## Important

- **Follow existing patterns** in the test directory
- **Run tests before committing** to verify they pass
- **Include edge cases** and error scenarios
- **Use data-testid** attributes for reliable selectors
