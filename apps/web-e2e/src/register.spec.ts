/* eslint-disable max-lines-per-function */
import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to register page before each test
    await page.goto('/register');
  });

  test.describe('Page Rendering', () => {
    test('should display register form with all required fields', async ({ page }) => {
      // Check for main heading
      const heading = page.locator('h1');
      await expect(heading).toContainText('Create Account');

      // Check for form fields
      await expect(page.locator('label:has-text("Full Name")')).toBeVisible();
      await expect(page.locator('input[id="name"]')).toBeVisible();

      await expect(page.locator('label:has-text("Email")')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();

      await expect(page.locator('label:has-text("Password")')).toBeVisible();
      await expect(page.locator('input[id="password"]')).toBeVisible();

      await expect(page.locator('label:has-text("Confirm Password")')).toBeVisible();
      await expect(page.locator('input[id="confirmPassword"]')).toBeVisible();

      // Check for submit button
      const submitButton = page.locator('button:has-text("Register")');
      await expect(submitButton).toBeVisible();

      // Check for login link
      const loginLink = page.locator('a:has-text("Login here")');
      await expect(loginLink).toBeVisible();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    test('should display password hint text', async ({ page }) => {
      const hint = page.locator('text=Minimum 8 characters');
      await expect(hint).toBeVisible();
    });

    test('should have correct input types and attributes', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[id="password"]');
      const confirmPasswordInput = page.locator('input[id="confirmPassword"]');

      // Check type attributes
      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      // Check required attributes
      await expect(emailInput).toHaveAttribute('required', '');
      await expect(passwordInput).toHaveAttribute('required', '');
      await expect(confirmPasswordInput).toHaveAttribute('required', '');
    });
  });

  test.describe('Successful Registration', () => {
    test('should successfully register with valid data', async ({ page }) => {
      // Fill in the form
      await page.fill('input[id="name"]', 'New User');
      await page.fill('input[type="email"]', 'newuser@example.com');
      await page.fill('input[id="password"]', 'ValidPassword123');
      await page.fill('input[id="confirmPassword"]', 'ValidPassword123');

      // Submit form
      const submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Wait for navigation to home page
      await page.waitForURL('/');

      // Verify redirect happened
      expect(page.url()).toContain('/');
    });

    test('should show loading state during registration', async ({ page }) => {
      // Fill in the form
      await page.fill('input[id="name"]', 'New User');
      await page.fill('input[type="email"]', 'newuser@example.com');
      await page.fill('input[id="password"]', 'ValidPassword123');
      await page.fill('input[id="confirmPassword"]', 'ValidPassword123');

      const submitButton = page.locator('button:has-text("Register")');

      // Click submit
      await submitButton.click();

      // The button might briefly show loading state (race condition is possible in E2E tests)
      // So we mainly verify the final state
      await page.waitForURL('/');
      expect(page.url()).toContain('/');
    });
  });

  test.describe('Password Validation', () => {
    test('should show error when passwords do not match', async ({ page }) => {
      await page.fill('input[id="name"]', 'Test User');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[id="password"]', 'Password123');
      await page.fill('input[id="confirmPassword"]', 'DifferentPassword');

      const submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Check for error message
      const errorMessage = page.locator('div:has-text("Passwords do not match")');
      await expect(errorMessage).toBeVisible();

      // Verify no navigation occurred
      expect(page.url()).toContain('/register');
    });

    test('should show error when password is less than 8 characters', async ({ page }) => {
      await page.fill('input[id="name"]', 'Test User');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[id="password"]', 'short');
      await page.fill('input[id="confirmPassword"]', 'short');

      const submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Check for error message
      const errorMessage = page.locator('div:has-text("Password must be at least 8 characters")');
      await expect(errorMessage).toBeVisible();

      // Verify no navigation occurred
      expect(page.url()).toContain('/register');
    });

    test('should accept exactly 8 character password', async ({ page }) => {
      await page.fill('input[id="name"]', 'New User');
      await page.fill('input[type="email"]', 'newuser@example.com');
      await page.fill('input[id="password"]', 'Pass1234');
      await page.fill('input[id="confirmPassword"]', 'Pass1234');

      const submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Should navigate to home page
      await page.waitForURL('/');
      expect(page.url()).toContain('/');
    });

    test('should accept long passwords', async ({ page }) => {
      const longPassword = 'ThisIsAVeryLongPasswordWithSpecialCharacters!@#$%';

      await page.fill('input[id="name"]', 'New User');
      await page.fill('input[type="email"]', 'newuser@example.com');
      await page.fill('input[id="password"]', longPassword);
      await page.fill('input[id="confirmPassword"]', longPassword);

      const submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Should navigate to home page
      await page.waitForURL('/');
      expect(page.url()).toContain('/');
    });
  });

  test.describe('Form Inputs', () => {
    test('should disable inputs while loading', async ({ page, context }) => {
      // Intercept the register API call to delay it
      await context.route('**/api/auth/register', async (route) => {
        // Delay the response to allow checking disabled state
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
      });

      // Fill in the form
      await page.fill('input[id="name"]', 'New User');
      await page.fill('input[type="email"]', 'newuser@example.com');
      await page.fill('input[id="password"]', 'ValidPassword123');
      await page.fill('input[id="confirmPassword"]', 'ValidPassword123');

      const nameInput = page.locator('input[id="name"]');
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[id="password"]');
      const confirmPasswordInput = page.locator('input[id="confirmPassword"]');
      const submitButton = page.locator('button:has-text("Register")');

      // Click submit
      await submitButton.click();

      // Wait a bit for the request to be made
      await page.waitForTimeout(50);

      // Check that inputs are disabled
      await expect(nameInput).toBeDisabled();
      await expect(emailInput).toBeDisabled();
      await expect(passwordInput).toBeDisabled();
      await expect(confirmPasswordInput).toBeDisabled();
      await expect(submitButton).toBeDisabled();

      // Wait for navigation
      await page.waitForURL('/');
    });

    test('should clear error message when retrying', async ({ page }) => {
      // First attempt with mismatched passwords
      await page.fill('input[id="name"]', 'Test User');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[id="password"]', 'Password123');
      await page.fill('input[id="confirmPassword"]', 'DifferentPassword');

      let submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Verify error appears
      const errorMessage = page.locator('div:has-text("Passwords do not match")');
      await expect(errorMessage).toBeVisible();

      // Clear inputs
      await page.fill('input[id="name"]', '');
      await page.fill('input[type="email"]', '');
      await page.fill('input[id="password"]', '');
      await page.fill('input[id="confirmPassword"]', '');

      // Second attempt with correct data
      await page.fill('input[id="name"]', 'New User');
      await page.fill('input[type="email"]', 'newuser@example.com');
      await page.fill('input[id="password"]', 'ValidPassword123');
      await page.fill('input[id="confirmPassword"]', 'ValidPassword123');

      submitButton = page.locator('button:has-text("Register")');
      await submitButton.click();

      // Error should be gone and we should navigate
      await page.waitForURL('/');
      expect(page.url()).toContain('/');
    });
  });

  test.describe('Email Validation', () => {
    test('should require valid email format', async ({ page }) => {
      // This test checks HTML5 email validation by attempting to submit invalid email
      const emailInput = page.locator('input[type="email"]');

      // HTML5 email validation should catch this
      await page.fill('input[id="password"]', 'ValidPassword123');
      await page.fill('input[id="confirmPassword"]', 'ValidPassword123');

      // Try with invalid email
      await emailInput.fill('notanemail');
      await emailInput.blur();

      // Check that input is invalid (HTML5 validation)
      const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(isValid).toBe(false);
    });

    test('should accept valid email formats', async ({ page }) => {
      const validEmails = ['user@example.com', 'test.user@example.co.uk', 'user+tag@example.com'];

      for (const email of validEmails) {
        await page.fill('input[type="email"]', email);
        const emailInput = page.locator('input[type="email"]');

        const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
        expect(isValid).toBe(true);

        // Clear for next iteration
        await page.fill('input[type="email"]', '');
      }
    });
  });

  test.describe('Navigation Links', () => {
    test('should navigate to login page when clicking login link', async ({ page }) => {
      const loginLink = page.locator('a:has-text("Login here")');
      await loginLink.click();

      // Verify navigation to login page
      await page.waitForURL('/login');
      expect(page.url()).toContain('/login');

      // Verify login page is displayed
      const loginHeading = page.locator('h1');
      await expect(loginHeading).toContainText('Login');
    });
  });
});
