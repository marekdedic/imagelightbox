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

test("can be controlled with keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo2.jpg");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo3.jpg");
  await page.keyboard.press("ArrowLeft");
  await expectImage(page, "images/demo2.jpg");
  await page.keyboard.press("Tab");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo2.jpg");
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("captures keyboard focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("#ilb-image")).toBeHidden();
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

test("can be controlled with the navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator(".ilb-navigation button").first()).toBeVisible();
  await expect(page.locator(".ilb-navigation button").nth(1)).toBeVisible();
  await expect(page.locator(".ilb-navigation button").nth(2)).toBeVisible();
  await page.locator(".ilb-navigation button").nth(2).click();
  await expectImage(page, "images/demo3.jpg");
  await page.locator(".ilb-navigation button").nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  await page.locator(".ilb-navigation button").nth(1).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo2.jpg");
});
