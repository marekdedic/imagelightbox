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
    await expect(page.locator("#imagelightbox")).toBeHidden();
});

test("shows a caption", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("caption").getByRole("link").first().click();
    await expect(page.locator("#imagelightbox")).toBeVisible();
    await expect(page.getByText("Sunset in Tanzania")).toHaveClass(
        "imagelightbox-caption",
    );
});

test("can be triggered manually", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Click me!" }).click();
    await expect(page.locator("#imagelightbox")).toBeVisible();
});
