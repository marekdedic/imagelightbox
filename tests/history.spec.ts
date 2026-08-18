import { expect, test } from "playwright-test-coverage";

import { expectImage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("has a working history", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("history").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo2.jpg");
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo2.jpg");
  await page.goBack();
  await expectImage(page, "images/demo1.jpg");
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can open history links", async ({ page }) => {
  await page.goto("/?imageLightboxIndex=2&imageLightboxSet=history");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo3.jpg");
});

test.describe("doesn't break on invalid history links", () => {
  test("invalid index", async ({ page }) => {
    await page.goto("/?imageLightboxIndex=42&imageLightboxSet=history");
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

  test("no index on a set that exists", async ({ page }) => {
    await page.goto("/?imageLightboxSet=history");
    await expect(page.locator("#ilb-image")).toBeHidden();
  });
});

test("closes when going back to a history state without an index", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("history").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await page.evaluate(() => {
    // The second state is only pushed so that going back lands on the first one
    window.history.pushState({ imageLightboxSet: "history" }, "");
    window.history.pushState(
      { imageLightboxIndex: "1", imageLightboxSet: "history" },
      "",
    );
  });
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can go forwards through the history", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("history").getByRole("link").first().click();
  await expectImage(page, "images/demo1.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo2.jpg");
  await page.goBack();
  await expectImage(page, "images/demo1.jpg");
  await page.goForward();
  await expectImage(page, "images/demo2.jpg");
});

test("has a working history with IDs", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("history-ids").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo1.jpg");
  await page.locator("#ilb-arrow-right").click();
  await expectImage(page, "images/demo2.jpg");
  await page.locator("#ilb-container").dispatchEvent("click");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo2.jpg");
  await page.goBack();
  await expectImage(page, "images/demo1.jpg");
  await page.goBack();
  await expect(page.locator("#ilb-image")).toBeHidden();
});

test("can open history links with IDs", async ({ page }) => {
  await page.goto("/?imageLightboxIndex=2&imageLightboxSet=history-ids");
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expectImage(page, "images/demo3.jpg");
});
