import type { Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

import { expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

/*
 * The container is a modal dialog, so the page behind it is inert and the
 * controls cannot be clicked for real once the lightbox is open. Calling the API
 * from the surrounding application is the scenario being covered.
 */
async function press(page: Page, className: string): Promise<void> {
  await page.evaluate((target) => {
    document.querySelector<HTMLButtonElement>(target)?.click();
  }, `.${className}`);
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

test("survives a gallery whose selector matches nothing", async ({ page }) => {
  const errors: Array<string> = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.goto("/fixtures.html");
  // The empty gallery is constructed on load, so the later ones only work if it did not throw
  await press(page, "programmatic_open");
  await expectImage(page, "images/demo1.jpg");
  expect(errors).toStrictEqual([]);
});
