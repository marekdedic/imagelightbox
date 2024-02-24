import { expect, test } from "playwright-test-coverage";

test("has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(
        page.getByRole("heading").getByText("Imagelightbox"),
    ).toBeVisible();
});
