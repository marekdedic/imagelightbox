import { expect, test } from "playwright-test-coverage";

import { expectImage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("can add images dynamically", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add another image" }).click();
  await expect(
    page.getByTestId("dynamic").getByRole("link").nth(3),
  ).toBeVisible();
  await page.getByTestId("dynamic").getByRole("link").nth(3).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo4.jpg");
});

test("doesn't add the same image to a gallery twice", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add another image" }).click();
  await expect(
    page.getByTestId("dynamic").getByRole("link").nth(3),
  ).toBeVisible();
  await page.getByTestId("dynamic").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  /*
   * `addImages` was called with the pre-existing links as well, so if they were
   * added again the gallery would hold seven images instead of four.
   */
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo2.jpg");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo3.jpg");
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo4.jpg");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("uses srcset and sizes for responsive images", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("responsive").locator("a").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "srcset",
    "images/demo1.jpg 1200w",
  );
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "sizes",
    "(min-width: 30px) 1200px",
  );
  // Responsive images have no href to fall back on
  await expect(page.locator("#ilb-image")).toHaveAttribute("src", "");
});

test("survives a gallery whose selector matches nothing", async ({ page }) => {
  const errors: Array<string> = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.goto("/fixtures.html");
  // The empty gallery is constructed on load, so the rest only works if it did not throw
  await page.getByTestId("programmatic").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  expect(errors).toStrictEqual([]);
});
