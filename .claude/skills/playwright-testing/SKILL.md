---
name: playwright-testing
description: "Playwright E2E and visual regression testing patterns. Use when writing tests, setting up test automation, verifying UI components, checking mobile breakpoints, or validating touch targets and thumb zone placement."
---

# Playwright Testing Patterns

## Test Structure

```typescript
// tests/e2e/intake-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Lead Intake Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('completes intake form successfully', async ({ page }) => {
    // Fill form
    await page.fill('[data-testid="name"]', 'John Doe')
    await page.fill('[data-testid="email"]', 'john@example.com')
    await page.fill('[data-testid="phone"]', '+14165551234')
    await page.selectOption('[data-testid="project-type"]', 'kitchen')

    // Submit
    await page.click('[data-testid="submit"]')

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="estimate"]')).toContainText('$')
  })

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.click('[data-testid="submit"]')
    await expect(page.locator('[data-testid="error-name"]')).toBeVisible()
  })
})
```

## Visual Regression Testing

```typescript
// tests/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test'

test('intake form matches reference', async ({ page }) => {
  await page.goto('/intake')

  // Wait for content to stabilize
  await page.waitForLoadState('networkidle')

  // Mask dynamic content
  await expect(page).toHaveScreenshot('intake-form.png', {
    maxDiffPixels: 100,  // ~95% match threshold
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('[data-testid="random-id"]')
    ]
  })
})
```

## Breakpoints (Mobile-First)

Test at 3 breakpoints:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 }
      }
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 }
      }
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1440, height: 900 }
      }
    }
  ]
})
```

## RedWhiteReno Specific Tests

### Mobile Thumb Zone Test

```typescript
test('CTA buttons are in thumb zone on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/intake')

  const submitButton = page.locator('[data-testid="submit"]')
  const box = await submitButton.boundingBox()

  // Button should be in bottom 30% of screen
  expect(box.y).toBeGreaterThan(667 * 0.7)
})
```

### Touch Target Size Test

```typescript
test('touch targets are at least 44x44px', async ({ page }) => {
  const buttons = page.locator('button, a, [role="button"]')
  const count = await buttons.count()

  for (let i = 0; i < count; i++) {
    const box = await buttons.nth(i).boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
})
```

## Update Baselines

When design intentionally changes:
```bash
npx playwright test --update-snapshots
```

## Running Tests

```bash
# All tests
npx playwright test

# Visual only
npx playwright test --grep visual

# Mobile only
npx playwright test --project=mobile

# With UI
npx playwright test --ui
```

## CI Integration

```yaml
# .github/workflows/test.yml
- name: Playwright Tests
  run: npx playwright test
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```
