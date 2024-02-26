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
    await page.goto("/?imageLightboxIndex=2&imageLightboxSet=j");
    await expect(page.locator("#imagelightbox")).toBeVisible();
    await expect(page.locator("#imagelightbox")).toHaveAttribute(
        "src",
        "images/demo3.jpg",
    );
});

test("has a working navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("navigation").getByRole("link").first().click();
    await expect(page.locator("#imagelightbox")).toBeVisible();
    await expect(page.locator("a.imagelightbox-navitem").first()).toBeVisible();
    await expect(page.locator("a.imagelightbox-navitem").nth(1)).toBeVisible();
    await expect(page.locator("a.imagelightbox-navitem").nth(2)).toBeVisible();
    // TODO: Fix issue where too quick navigation breaks the lightbox
    /*
    await page.locator("a.imagelightbox-navitem").nth(2).click();
    await expect(page.locator("#imagelightbox")).toHaveAttribute(
        "src",
        "images/demo3.jpg",
    );
    */
});
