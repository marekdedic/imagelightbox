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

test("can be controlled with arrows", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("arrows").getByRole("link").first().click();
    await expect(page.locator("#imagelightbox")).toBeVisible();
    await page.locator(".imagelightbox-arrow-right").click();
    await expect(page.locator("#imagelightbox")).toHaveAttribute(
        "src",
        "images/demo2.jpg",
    );
});

test("can add images dynamically", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Add another image" }).click();
    await expect(
        page.getByTestId("dynamic").getByRole("link").nth(3),
    ).toBeVisible();
    await page.getByTestId("dynamic").getByRole("link").nth(3).click();
    await expect(page.locator("#imagelightbox")).toBeVisible();
    await expect(page.locator("#imagelightbox")).toHaveAttribute(
        "src",
        "images/demo4.jpg",
    );
});

test("can open history links", async ({ page }) => {
    await page.goto("/?imageLightboxIndex=2");
    // TODO: Fix issue with double imagelightbox being opened (remove .first() to see it)
    await expect(page.locator("#imagelightbox").first()).toBeVisible();
    await expect(page.locator("#imagelightbox").first()).toHaveAttribute(
        "src",
        "images/demo3.jpg",
    );
});
