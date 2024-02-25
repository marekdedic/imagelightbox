import { expect, test } from "playwright-test-coverage";

test("has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(
        page.getByRole("heading").getByText("Imagelightbox"),
    ).toBeVisible();
});

test("opens and closes the lightbox", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("activity").getByRole("link").first().click();
    await expect(page.locator("#imagelightbox")).toBeVisible();
    await page.locator("#container").dispatchEvent("click");
    await expect(page.locator("#imagelightbox")).not.toBeVisible();
});
