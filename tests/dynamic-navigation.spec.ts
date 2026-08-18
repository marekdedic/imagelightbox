import { expect, test } from "playwright-test-coverage";

import { expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("shows a navigation item for an image added while closed", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".ilb-navigation button")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Add image to the navigation gallery" })
    .click();
  await page
    .getByTestId("dynamic-navigation")
    .getByRole("link")
    .first()
    .click();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator(".ilb-navigation button")).toHaveCount(3);
  await page.locator(".ilb-navigation button").nth(2).click();
  await expectImage(page, "images/demo3.jpg");
});

test("updates the navigation strip for an image added while open", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByTestId("dynamic-navigation")
    .getByRole("link")
    .first()
    .click();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator(".ilb-navigation button")).toHaveCount(2);
  /*
   * The lightbox is a modal dialog, so the page behind it is inert and the
   * button cannot be clicked for real. Adding images programmatically while the
   * lightbox is open is the scenario being covered.
   */
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>(".add_image_navigation")?.click();
  });
  await expect(page.locator(".ilb-navigation button")).toHaveCount(3);
  await settle();
  // The newly added item has to actually navigate to the new image
  await page.locator(".ilb-navigation button").nth(2).click();
  await expectImage(page, "images/demo3.jpg");
  await expect(page.locator(".ilb-navigation button").nth(2)).toHaveClass(
    /ilb-navigation-active/,
  );
});
