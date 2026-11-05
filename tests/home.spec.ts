import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Circle.so home', () => {
  test('app origin responds', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(page).toHaveURL(/circle\.so/);
  });
});
