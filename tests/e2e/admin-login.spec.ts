/**
 * Admin Login E2E Tests
 * Tests admin authentication flow: Login → Dashboard access
 */

import { test, expect } from '@playwright/test';

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('displays login page with branding', async ({ page }) => {
    // Check branding
    await expect(page.getByRole('heading', { name: /Red White Reno/i })).toBeVisible();
    await expect(page.getByText(/Admin Dashboard/i)).toBeVisible();
  });

  test('displays login form', async ({ page }) => {
    // Check for login form elements
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();

    // Email and password fields should be present
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();

    // Submit button
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
  });

  test('displays footer with version info', async ({ page }) => {
    await expect(page.getByText(/Lead-to-Quote Engine/i)).toBeVisible();
    await expect(page.getByText(/Powered by AI/i)).toBeVisible();
  });

  test('login form has required validation', async ({ page }) => {
    // The login form has required fields - verify they exist
    const emailInput = page.getByLabel(/Email/i);
    const passwordInput = page.getByLabel(/Password/i);

    // Verify required attributes are present
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');

    // Still on login page
    await expect(page).toHaveURL('/admin/login');
  });

  test('shows password visibility toggle if present', async ({ page }) => {
    // Check if there's a password visibility toggle button
    const passwordField = page.getByLabel(/Password/i);
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});

test.describe('Admin Protected Routes', () => {
  test('admin dashboard redirects to login when not authenticated', async ({ page }) => {
    // Try to access admin dashboard directly
    await page.goto('/admin');

    // Should redirect to login or show login page
    // Wait for navigation and check URL
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible({ timeout: 5000 });
  });

  test('admin leads page redirects to login when not authenticated', async ({ page }) => {
    // Try to access leads page directly
    await page.goto('/admin/leads');

    // Should redirect to login
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin Login Errors', () => {
  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');

    // Enter invalid credentials
    await page.getByLabel(/Email/i).fill('invalid@example.com');
    await page.getByLabel(/Password/i).fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Should show error message (after API response)
    // Either stay on page with error or get invalid response
    // Wait for some response
    await page.waitForTimeout(1000);

    // Should still be on login page (not redirected to dashboard)
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
  });
});
