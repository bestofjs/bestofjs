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

  await expect(page).toHaveTitle(/Best of JS/);
});


/*
* Header items tests
* =========================================
*/

test('home section is visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
});

test('projects section is visible', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('banner').getByRole('link', { name: 'Projects' })).toBeVisible();
});

test('tags section is visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('banner').getByRole('link', { name: 'Tags' })).toBeVisible();
});

test('monthly section is visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Monthly', exact: true })).toBeVisible();
});

// TODO: Expand the tests inside this dropdown
test('more section is visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'More' })).toBeVisible();
});


/*
* Home page panels tests
* =========================================
*/

test('hot projects is visible', async ({ page }) => {
    await page.goto('/');
  
    await expect(page.getByRole('heading', { name: 'Hot Projects' })).toBeVisible();
});
  
test('featured section is visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Featured' })).toBeVisible();
});

test('recently added projects is visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Recently Added Projects' })).toBeVisible();
});
  

/*
* Navigation tests
* =========================================
*/

test('go to all projects page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Projects' }).click();
  
    await expect(page.getByRole('heading', { name: /All Projects•.*/ })).toBeVisible();
});
  
test('go to tags page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Tags' }).click();
    await expect(page.getByRole('heading', { name: 'All Tags' })).toBeVisible();
});
  
test('go to monthly rankings page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Monthly', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Monthly Rankings' })).toBeVisible();
});
