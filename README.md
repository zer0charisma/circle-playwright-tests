# Circle.so Playwright Tests

End-to-end tests for the [Circle.so](https://circle.so) web app, written in Playwright and TypeScript.

The suite has two versions of the same tests: a reliable version built with page objects and good practices, and a deliberately naive version that shows common mistakes. Comparing them side by side shows what makes automated tests trustworthy, and why some tests pass today and fail tomorrow.

> Personal project. Not affiliated with Circle.

## What's tested

| Area | Spec file |
|---|---|
| Home page | `tests/home.spec.ts` |
| Login | `tests/login.spec.ts` |
| Signup | `tests/signup.spec.ts` |
| Naive versions (for comparison) | `tests/bad-example.spec.ts` |

Every test runs in **Chromium, Firefox, and WebKit** to catch browser-specific bugs.

## Project structure

```
pages/            Page objects: locators and actions for each page
  base.page.ts    Shared helpers used by all pages
  home.page.ts
  login.page.ts
  signup.page.ts
tests/            Test specs
playwright.config.ts
```

Page objects keep locators in one place, so when the UI changes, the fix happens in one file instead of every test.

## Good vs. naive tests

| | Good tests | Naive tests (`bad-example.spec.ts`) |
|---|---|---|
| **Waiting** | Rely on Playwright's auto-waiting and web-first assertions | Hard-coded sleeps (`waitForTimeout`) |
| **Locators** | Role-, label-, or test-ID-based locators in page objects | Brittle CSS/XPath selectors repeated inline |
| **Assertions** | Check what the user actually sees | Weak or missing assertions |
| **Independence** | Each test sets up its own state | Tests depend on each other's order |

## Config choices

A few settings in `playwright.config.ts` are deliberate:

- **No retries locally, 2 in CI.** Flaky tests show up while developing instead of being hidden, and CI tolerates shared-runner noise.
- **Short assertion timeout (5s) inside a 30s test timeout.** A missing element fails fast instead of eating the whole test budget.
- **Traces, screenshots, and videos kept only on failure.** Full debugging detail when something breaks, with no cost on passing runs.
- **`test.only` fails the build in CI.** A leftover `.only` can't silently shrink coverage.
- **Base URL and credentials come from `.env`.** The same suite can target different environments without code changes, and no secrets live in the code.

## Running the tests

**Prerequisites:** Node.js 18+ and a Circle.so test account.

```bash
npm install
npx playwright install
cp .env.example .env    # then fill in your test account details
npx playwright test
```

Run only the naive tests:

```bash
npx playwright test tests/bad-example.spec.ts
```

View the HTML report after a run:

```bash
npx playwright show-report
```

> Use a dedicated test account, not a personal one. These tests run against the live Circle.so site.