import type { Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

import { expectImage, settle } from "./helpers";

const playbackState = async (page: Page): Promise<PlaybackState> =>
  await page.locator("video#ilb-image").evaluate((video: HTMLVideoElement) => ({
    currentTime: video.currentTime,
    paused: video.paused,
  }));

interface PlaybackState {
  currentTime: number;
  paused: boolean;
}

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

test("doesn't autoplay a video with autoplay disabled", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("video").locator("a").nth(1).click();
  await expect(page.locator("video#ilb-image")).toBeVisible();
  await settle();
  expect(await playbackState(page)).toStrictEqual({
    currentTime: 0,
    paused: true,
  });
});

test("autoplays a video with autoplay enabled", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("video").locator("a").nth(3).click();
  await expect(page.locator("video#ilb-image")).toBeVisible();
  /*
   * Playback making progress is the signal to wait for - paused flips to false
   * a moment before currentTime actually starts moving.
   */
  await expect
    .poll(async () => (await playbackState(page)).currentTime)
    .toBeGreaterThan(0);
});
