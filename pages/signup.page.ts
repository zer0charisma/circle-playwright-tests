import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SignupPage extends BasePage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly fullNameInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly signUpButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /14-day free trial/i });
    this.emailInput = page.getByLabel(/email/i);
    this.fullNameInput = page.getByLabel(/full name/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.termsCheckbox = page.getByRole('checkbox', {
      name: /i agree to the terms and have read the privacy policy/i,
    });
    this.signUpButton = page.getByRole('button', { name: /^sign up$/i });
    this.backButton = page.getByRole('button', { name: /^back$/i });
  }

  async open() {
    await this.goto('/users/sign_up');
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    await this.signUpButton.click();
    await this.fullNameInput.waitFor();
  }

  async fillAccountDetails(fullName: string, password: string) {
    await this.fullNameInput.fill(fullName);
    await this.passwordInput.fill(password);
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }
}
