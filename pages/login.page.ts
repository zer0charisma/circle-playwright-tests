import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    // Circle's fields are labelled via accessible name on the textbox, not always a <label for>.
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /^password$/i });
    this.submitButton = page.getByRole('button', { name: /^sign in$/i });
    this.signUpLink = page.getByRole('link', { name: /^sign up$/i });
  }

  async open() {
    // /login 404s on app.circle.so ("Oops! The page was not found.").
    // Devise route /users/sign_in redirects to login.circle.so/sign_in.
    await this.goto('/users/sign_in');
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async goToSignUp() {
    await this.signUpLink.click();
  }
}
