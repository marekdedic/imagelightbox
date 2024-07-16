import { expect, test } from "playwright-test-coverage";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("can be controlled with image clicks", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("overlay").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await page.locator("#ilb-image").click({ position: { x: 200, y: 32 } });
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  await page.locator("#ilb-image").click({ position: { x: 200, y: 32 } });
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  await page.locator("#ilb-image").click({ position: { x: 20, y: 32 } });
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
});

test("can be controlled with keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("fullscreen").getByRole("link").first().click();
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
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.keyboard.press("Tab");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can be controlled with arrows", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("arrows").getByRole("link").first().click();
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
  await page.locator("#ilb-arrow-right").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
  await page.locator("#ilb-arrow-left").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.locator("#ilb-arrow-right").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
  await page.locator("#ilb-arrow-right").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await page.locator("#ilb-arrow-left").click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
});

test("can be controlled with the navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("navigation").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
  await expect(page.locator(".ilb-navigation button").first()).toBeVisible();
  await expect(page.locator(".ilb-navigation button").nth(1)).toBeVisible();
  await expect(page.locator(".ilb-navigation button").nth(2)).toBeVisible();
  await page.locator(".ilb-navigation button").nth(2).click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo3.jpg",
  );
  await page.locator(".ilb-navigation button").nth(1).click();
  await expect(page.locator("#ilb-image")).toHaveCount(2);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
  await page.locator(".ilb-navigation button").nth(1).click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo2.jpg",
  );
});
