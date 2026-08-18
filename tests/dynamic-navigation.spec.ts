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
  await page.goto("/fixtures.html");
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
  await page.goto("/fixtures.html");
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

test("doesn't show navigation items from an unrelated gallery", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator(".ilb-navigation button")).toHaveCount(3);
  /*
   * The plain dynamic gallery is a separate instance with navigation disabled,
   * so adding an image to it must not touch the open gallery's strip.
   */
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>(".add_image")?.click();
  });
  await expect(page.getByTestId("dynamic").getByRole("link")).toHaveCount(4);
  await expect(page.locator(".ilb-navigation button")).toHaveCount(3);
});

test("keeps the navigation strip intact across reopening", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator(".ilb-navigation button")).toHaveCount(3);
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await expect(page.locator(".ilb-navigation button")).toHaveCount(0);
  // Reopening must neither lose the items nor duplicate them
  await page.getByTestId("navigation").getByRole("link").nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  await expect(page.locator(".ilb-navigation button")).toHaveCount(3);
  await expect(page.locator(".ilb-navigation button").nth(1)).toHaveClass(
    /ilb-navigation-active/,
  );
  await page.locator(".ilb-navigation button").nth(2).click();
  await expectImage(page, "images/demo3.jpg");
});
