import { expect, test } from "playwright-test-coverage";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("has a working history", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("history").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.locator("#ilb-arrow-right").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.goBack();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can open history links", async ({ page }) => {
  await page.goto("/?imageLightboxIndex=2&imageLightboxSet=j");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
});

test.describe("doesn't break on invalid history links", () => {
  test("invalid index", async ({ page }) => {
    await page.goto("/?imageLightboxIndex=42&imageLightboxSet=j");
    await expect(page.locator("#ilb-image")).toBeHidden();
  });
  test("no index", async ({ page }) => {
    await page.goto("/?imageLightboxSet=j");
    await expect(page.locator("#ilb-image")).toBeHidden();
  });
  test("invalid set", async ({ page }) => {
    await page.goto("/?imageLightboxIndex=2&imageLightboxSet=asdf");
    await expect(page.locator("#ilb-image")).toBeHidden();
  });
});

test("has a working history with IDs", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("history-ids").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.locator("#ilb-arrow-right").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.goBack();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can open history links with IDs", async ({ page }) => {
  await page.goto("/?imageLightboxIndex=2&imageLightboxSet=k");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
});
