import { expect, test } from "playwright-test-coverage";

import { currentImage, expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("can be controlled with image clicks", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await settle();
  await currentImage(page).click({ position: { x: 200, y: 32 } });
  await expectImage(page, "images/demo2.jpg");
  await settle();
  await currentImage(page).click({ position: { x: 200, y: 32 } });
  await expectImage(page, "images/demo3.jpg");
  await settle();
  await currentImage(page).click({ position: { x: 20, y: 32 } });
  await expectImage(page, "images/demo2.jpg");
});

test("can be controlled with arrows", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("quit").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo2.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo3.jpg");
  await page.locator("#ilb-arrow-left").click();
  await expectImage(page, "images/demo2.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo3.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo1.jpg");
  await page.locator("#ilb-arrow-left").click();
  await expectImage(page, "images/demo3.jpg");
});
