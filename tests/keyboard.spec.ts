import { expect, test } from "playwright-test-coverage";

import { expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("ignores the arrow keys when the keyboard is disabled", async ({
  page,
}) => {
  await page.goto("/fixtures.html");
  await page.getByTestId("no-keyboard").getByRole("link").nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await settle();
  await expectImage(page, "images/demo2.jpg");
});

test("still navigates with the arrows when the keyboard is disabled", async ({
  page,
}) => {
  await page.goto("/fixtures.html");
  await page.getByTestId("no-keyboard").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  // Only the keyboard is disabled, the rest of the navigation still works
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo2.jpg");
  await page.locator("#ilb-close-button").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.getByTestId("no-keyboard").getByRole("link").nth(2).click();
  await expectImage(page, "images/demo3.jpg");
});
