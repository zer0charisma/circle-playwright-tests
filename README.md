## Good vs. naive tests

`tests/bad-example.spec.ts` walks through signup with common anti-patterns built in. Each one is a real mistake that makes tests flaky, misleading, or hard to maintain.

| Problem | Naive version | Why it hurts | Good version |
|---|---|---|---|
| **Shared state** | One page and one mutable `email` shared across the file; each test continues where the last one stopped | One failure cascades into the rest, and no test can run on its own | Each test gets its own fresh `page` fixture and sets up its own state |
| **Hidden order dependency** | Relies on running in order, but the config sets `fullyParallel: true` and the file isn't marked `test.describe.serial` | Tests can land on different workers and start on the wrong page | Tests are independent, so parallel runs are safe |
| **Hard-coded sleeps** | `waitForTimeout()` after nearly every step (up to 5s) | Slow when the app is fast, flaky when it's slow | Playwright auto-waiting and web-first assertions (`await expect(locator).toBeVisible()`) |
| **Brittle selectors** | `form button`, `button.btn-primary`, the first `input[type="checkbox"]`, comma "fallback" selectors | Break on small UI changes, or silently match the wrong element | Role- and label-based locators, kept in page objects |
| **Weak assertions** | `expect(await page.$('h1')).toBeTruthy()` passes if *any* heading exists; one test has no assertion at all | Tests pass while the feature is broken | Assertions check the specific thing the user should see |
| **No auto-retry on checks** | Uses `page.$()` snapshots | Checks once and moves on, so timing decides pass or fail | Locator assertions retry until they pass or time out |
| **Hard-coded URL** | Full `https://app.circle.so/...` in the test | Can't point the suite at another environment | Relative paths resolved against `baseURL` from `.env` |
| **Bypasses the fixture** | Opens its own page with `browser.newPage()` | Loses the config's per-test settings, so failure screenshots, video, and traces may not be captured | Uses the built-in `page` fixture |