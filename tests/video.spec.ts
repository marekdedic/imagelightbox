import { expect, test } from "playwright-test-coverage";

import { expectImage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("shows a video instead of an image", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("video").locator("a").nth(1).click();
  await expect(page.locator("video#ilb-image")).toBeVisible();
  await expect(page.locator("video#ilb-image")).toHaveAttribute(
    "controls",
    "controls",
  );
  await expect(page.locator("video#ilb-image source")).toHaveAttribute(
    "src",
    "images/video.m4v",
  );
  await expect(page.locator("video#ilb-image source")).toHaveAttribute(
    "type",
    "video/mp4",
  );
});

test("preloads video metadata before the video is opened", async ({ page }) => {
  await page.goto("/");
  // The video element is created up front, outside of the DOM
  const videoLink = page.getByTestId("video").locator("a").nth(1);
  await expect(videoLink).toHaveAttribute("data-ilb2-video-id", /.+/);
  await videoLink.click();
  await expect(page.locator("video#ilb-image")).toHaveAttribute(
    "preload",
    "metadata",
  );
});

test("can navigate between images and videos", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("video").locator("a").first().click();
  await expectImage(page, "images/demo1.jpg");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("video#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveCount(1);
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo3.jpg");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("video#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveCount(1);
});

test("reuses the same preloaded video element", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("video").locator("a").nth(1).click();
  await expect(page.locator("video#ilb-image")).toBeVisible();
  await page.locator("video#ilb-image").evaluate((video) => {
    video.dataset["ilbTestMarker"] = "marked";
  });
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo3.jpg");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("video#ilb-image")).toHaveAttribute(
    "data-ilb-test-marker",
    "marked",
  );
});
