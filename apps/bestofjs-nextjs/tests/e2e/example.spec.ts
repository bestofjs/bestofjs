import { Browser, BrowserContext, chromium, expect, Page } from "@playwright/test";
import { afterAll, beforeAll, describe, test } from "vitest";

describe("playwright meets vitest", () => {
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("has title", async () => {
    await page.goto("https://playwright.dev");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("get started link", async () => {
    await page.goto("https://playwright.dev");

    // Click the get started link.
    await page.getByRole("link", { name: "Get started" }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*intro/);
  });
});

  // // Expects page to have a heading with the name of Installation.
  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
