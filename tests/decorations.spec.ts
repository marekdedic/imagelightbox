import { expect, test } from "playwright-test-coverage";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("shows the overlay", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await expect(page.locator("#ilb-container")).toBeVisible();
  await expect(page.locator("#ilb-container")).toHaveClass("ilb-overlay");
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can be closed with the close button", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await expect(page.locator("#ilb-close-button")).toBeVisible();
  await page.locator("#ilb-close-button").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("shows a caption", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("caption").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await expect(page.getByText("Sunset in Tanzania")).toHaveId("ilb-caption");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await expect(page.locator("#ilb-caption")).toBeHidden();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
  await expect(page.getByText("Just another sunset in Tanzania")).toHaveId(
    "ilb-caption",
  );
});
