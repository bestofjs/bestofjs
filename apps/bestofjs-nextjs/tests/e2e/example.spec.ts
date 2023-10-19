import { test, expect, chromium, type Browser} from '@playwright/test';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let browser: Browser, context, page;

test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

test.afterAll(async () => {
  await browser.close();
});

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Best of JS/);
});

test('hot projects is visible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hot Projects' })).toBeVisible();
});

// test('projects page', async ({ page }) => {
//   await page.goto('/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Projects' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
// });
