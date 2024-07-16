import { expect, test } from "playwright-test-coverage";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading").getByText("Imagelightbox"),
  ).toBeVisible();
});

test("opens and closes the lightbox", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("activity").getByRole("link").first().click();
  await expect(page.locator("#ilb-activity-indicator")).toBeVisible();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-activity-indicator")).toBeHidden();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can be triggered manually", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Click me!" }).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
});

test("can add images dynamically", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add another image" }).click();
  await expect(
    page.getByTestId("dynamic").getByRole("link").nth(3),
  ).toBeVisible();
  await page.getByTestId("dynamic").getByRole("link").nth(3).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo4.jpg",
  );
});

test("quits on end", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("quit").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.getByTestId("quit").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("quits on image click", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("quit").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.locator("#ilb-image").click();
  await expect(page.locator("#ilb-image")).toBeHidden();
});
