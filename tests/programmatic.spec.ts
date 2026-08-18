import type { Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

import { clickThroughModal, expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

async function press(page: Page, className: string): Promise<void> {
  await clickThroughModal(page, `.${className}`);
}

test("can be driven entirely through the API", async ({ page }) => {
  await page.goto("/fixtures.html");
  await press(page, "programmatic_open");
  await expectImage(page, "images/demo1.jpg");
  await press(page, "programmatic_next");
  await expectImage(page, "images/demo2.jpg");
  await press(page, "programmatic_next");
  await expectImage(page, "images/demo3.jpg");
  await press(page, "programmatic_previous");
  await expectImage(page, "images/demo2.jpg");
  await press(page, "programmatic_close");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can be opened on a given image", async ({ page }) => {
  await page.goto("/fixtures.html");
  await press(page, "programmatic_open_third");
  await expectImage(page, "images/demo3.jpg");
});

test("ignores opening an image from another gallery", async ({ page }) => {
  await page.goto("/fixtures.html");
  await press(page, "programmatic_open_foreign");
  await settle();
  await expect(page.locator("#ilb-image")).toHaveCount(0);
  // The gallery still works normally afterwards
  await press(page, "programmatic_open");
  await expectImage(page, "images/demo1.jpg");
});

test("ignores navigating and closing while closed", async ({ page }) => {
  await page.goto("/fixtures.html");
  await press(page, "programmatic_next");
  await press(page, "programmatic_previous");
  await press(page, "programmatic_close");
  await settle();
  await expect(page.locator("#ilb-image")).toHaveCount(0);
  await expect(page.locator("#ilb-container")).toBeHidden();
  await press(page, "programmatic_open");
  await expectImage(page, "images/demo1.jpg");
});

test("ignores opening while already open", async ({ page }) => {
  await page.goto("/fixtures.html");
  await press(page, "programmatic_open_third");
  await expectImage(page, "images/demo3.jpg");
  await press(page, "programmatic_open");
  await settle();
  // Still showing the third image, and not a second one on top of it
  await expectImage(page, "images/demo3.jpg");
});

test("can be triggered from a button on the page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Click me!" }).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
});
