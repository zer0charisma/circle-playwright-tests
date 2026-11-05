import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';

test.describe('Circle.so signup', () => {
  test('walks the signup flow up to account creation', async ({ page }) => {
    const login = new LoginPage(page);
    const signup = new SignupPage(page);

    await login.open();
    await login.goToSignUp();

    await expect(signup.heading).toBeVisible();
    await expect(signup.emailInput).toBeVisible();
    await expect(signup.signUpButton).toBeVisible();

    await signup.submitEmail(`pw-signup-${Date.now()}@example.com`);
    await expect(signup.fullNameInput).toBeVisible();
    await expect(signup.passwordInput).toBeVisible();
    await expect(signup.termsCheckbox).toBeVisible();

    await signup.fillAccountDetails('Playwright Tester', 'Playwright!23456');
    await signup.acceptTerms();

    await expect(signup.signUpButton).toBeEnabled();
    await expect(page).toHaveURL(/sign_up/);
  });
});
