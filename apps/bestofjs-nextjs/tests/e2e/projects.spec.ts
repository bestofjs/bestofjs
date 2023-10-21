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

test('go to all projects page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click();

  await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
});

test('project details page works', async ({ page }) => {
  await page.goto('/projects/react');

  await expect(page).toHaveTitle('Best of JS • React');
});

test('invalid project shows not found', async ({ page }) => {
  const invalidProject = 'react0958109348123_';
  await page.goto(`/projects/${invalidProject}`);

  await expect(page.getByText('Project not found!')).toBeVisible();
});

