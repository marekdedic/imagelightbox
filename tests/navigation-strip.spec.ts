import type { Locator, Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

import { clickThroughModal, expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

function items(page: Page): Locator {
  return page.locator(".ilb-navigation button");
}

test("can be controlled with the navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await expect(items(page).first()).toBeVisible();
  await expect(items(page).nth(1)).toBeVisible();
  await expect(items(page).nth(2)).toBeVisible();
  await items(page).nth(2).click();
  await expectImage(page, "images/demo3.jpg");
  await items(page).nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  // Clicking the already active item changes nothing
  await items(page).nth(1).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo2.jpg");
});

test("stays open when tapping the navigation strip", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await expect(page.locator(".ilb-navigation")).toBeVisible();
  await settle();
  /*
   * The container quits on touchend as well as on click, so the navigation has
   * to stop the event from reaching it. Desktop browsers don't all expose the
   * Touch constructor, so a minimal stand-in event is dispatched instead.
   */
  await page.evaluate(() => {
    const event = new Event("touchend", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "touches", { value: [{ pageX: 0 }] });
    document.querySelector(".ilb-navigation")?.dispatchEvent(event);
  });
  await expectImage(page, "images/demo1.jpg");
});

test("keeps the navigation strip intact across reopening", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await expect(items(page)).toHaveCount(3);
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await expect(items(page)).toHaveCount(0);
  // Reopening must neither lose the items nor duplicate them
  await page.getByTestId("navigation").getByRole("link").nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  await expect(items(page)).toHaveCount(3);
  await expect(items(page).nth(1)).toHaveClass(/ilb-navigation-active/);
  await items(page).nth(2).click();
  await expectImage(page, "images/demo3.jpg");
});

test("doesn't show navigation items from an unrelated gallery", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await expect(items(page)).toHaveCount(3);
  /*
   * The plain dynamic gallery is a separate instance with navigation disabled,
   * so adding an image to it must not touch the open gallery's strip.
   */
  await clickThroughModal(page, ".add_image");
  await expect(page.getByTestId("dynamic").getByRole("link")).toHaveCount(4);
  await expect(items(page)).toHaveCount(3);
});

test("shows a navigation item for an image added while closed", async ({
  page,
}) => {
  await page.goto("/fixtures.html");
  await expect(items(page)).toHaveCount(0);
  await page
    .getByRole("button", { name: "Add image to the navigation gallery" })
    .click();
  await page
    .getByTestId("dynamic-navigation")
    .getByRole("link")
    .first()
    .click();
  await expectImage(page, "images/demo1.jpg");
  await expect(items(page)).toHaveCount(3);
  await items(page).nth(2).click();
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
  await expect(items(page)).toHaveCount(2);
  await clickThroughModal(page, ".add_image_navigation");
  await expect(items(page)).toHaveCount(3);
  await settle();
  // The newly added item has to actually navigate to the new image
  await items(page).nth(2).click();
  await expectImage(page, "images/demo3.jpg");
  await expect(items(page).nth(2)).toHaveClass(/ilb-navigation-active/);
});
