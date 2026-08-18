import { expect, test } from "playwright-test-coverage";

import { expectImage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("shows an activity indicator while the image loads", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-activity-indicator")).toBeVisible();
  await expect(page.locator("#ilb-image")).toBeVisible();
  // It is taken down again once the image is there
  await expect(page.locator("#ilb-activity-indicator")).toBeHidden();
  await expectImage(page, "images/demo1.jpg");
});

test("shows the overlay", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator("#ilb-container")).toBeVisible();
  await expect(page.locator("#ilb-container")).toHaveClass("ilb-overlay");
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can be closed with the close button", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator("#ilb-close-button")).toBeVisible();
  await page.locator("#ilb-close-button").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("shows a caption", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("caption").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.getByText("Sunset in Tanzania")).toHaveId("ilb-caption");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo2.jpg");
  await expect(page.locator("#ilb-caption")).toBeHidden();
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo3.jpg");
  await expect(page.getByText("Just another sunset in Tanzania")).toHaveId(
    "ilb-caption",
  );
});

test("stays open when clicking the caption", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("caption").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-caption")).toBeVisible();
  // The caption sits inside the container, but its clicks must not quit
  await page.locator("#ilb-caption").click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
});

test("clears the caption when there is nothing to fall back on", async ({
  page,
}) => {
  await page.goto("/fixtures.html");
  await page.getByTestId("caption-fallback").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.getByText("A caption")).toHaveId("ilb-caption");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo2.jpg");
  // The second link has neither a caption attribute nor an image to take an alt from
  await expect(page.locator("#ilb-caption")).toBeHidden();
});
