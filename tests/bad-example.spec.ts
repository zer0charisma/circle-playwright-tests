import { test, expect, type Page } from '@playwright/test';

// One page + one email for the whole file. Tests assume they run in order
// on the same tab, so whatever the previous test left behind is still there.
let page: Page;
let email = 'qa.user@circle.test';

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('https://app.circle.so/users/sign_in');
  await page.waitForTimeout(5000);
});

test.afterAll(async () => {
  await page.close();
});

test('open signup from login', async () => {
  await page.click('a[href*="sign_up"]');
  await page.waitForTimeout(3000);
  expect(await page.$('h1')).toBeTruthy();
});

test('type email and continue', async () => {
  email = 'shared-' + Date.now() + '@circle.test';
  await page.fill('input[type="email"]', email);
  await page.waitForTimeout(1000);
  await page.click('form button');
  await page.waitForTimeout(4000);
});

test('fill the rest of signup', async () => {
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('.password-field input, input[type="password"]', 'Password123!');
  await page.waitForTimeout(2000);
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(1000);
  const signupBtn = await page.$('button.btn-primary, button[type="submit"]');
  expect(signupBtn).toBeTruthy();
  expect(page.url()).toContain('sign_up');
});
