import { expect, test } from "playwright-test-coverage";

test("works with basic configuration", async ({ page }) => {
  await page.goto("/");
});
