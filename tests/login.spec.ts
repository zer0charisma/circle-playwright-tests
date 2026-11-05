import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Circle.so login', () => {
  test('login page is reachable and shows email/password fields', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
  });

  test('can submit credentials from env', async ({ page }) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    test.skip(
      !email || !password || email.includes('example.com') || password === 'replace-me',
      'Set TEST_EMAIL and TEST_PASSWORD in .env to run an authenticated login.'
    );

    const login = new LoginPage(page);
    await login.open();
    await login.signIn(email!, password!);

    await expect(page).not.toHaveURL(/\/login/);
  });
});
