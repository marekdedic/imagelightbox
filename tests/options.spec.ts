import { expect, test } from "playwright-test-coverage";

import { currentImage, expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("omits all decorations when they are disabled", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("minimal").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-activity-indicator")).toHaveCount(0);
  await expect(page.locator("#ilb-arrow-left")).toHaveCount(0);
  await expect(page.locator("#ilb-arrow-right")).toHaveCount(0);
  await expect(page.locator("#ilb-close-button")).toHaveCount(0);
  await expect(page.locator("#ilb-fullscreen-button")).toHaveCount(0);
  await expect(page.locator("#ilb-container")).not.toHaveClass("ilb-overlay");
});

test("stays open on document click when quitOnDocClick is disabled", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("minimal").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await page.locator("#ilb-container").dispatchEvent("click");
  await expectImage(page, "images/demo1.jpg");
  // Keyboard navigation still works, so the lightbox is genuinely still open
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo2.jpg");
});

test("quits at both ends of the gallery when quitOnEnd is enabled", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo2.jpg");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo3.jpg");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("quits instead of navigating when quitOnImgClick is enabled", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("quit").getByRole("link").nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  await settle();
  // Without quitOnImgClick, a click on the right third would go to the next image
  await currentImage(page).click({ position: { x: 100, y: 32 } });
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("ignores images not matching allowedTypes", async ({ page }) => {
  await page.goto("/");
  const link = page.getByTestId("allowedtypes").getByRole("link").first();
  await expect(link).toHaveAttribute("href", "images/demo1.jpg");
  await link.click();
  // The link was never registered, so the browser just follows it
  await expect(page).toHaveURL(/images\/demo1\.jpg$/);
  await expect(page.locator("#ilb-image")).toHaveCount(0);
});
