import type { Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

import { currentImage, expectImage, settle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

/*
 * The quit gallery is used because it has quitOnEnd disabled, so a swipe in
 * either direction from the middle image stays inside the gallery.
 */
async function openMiddleImage(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByTestId("quit").getByRole("link").nth(1).click();
  await expectImage(page, "images/demo2.jpg");
  await settle();
}

async function swipe(
  page: Page,
  from: number,
  to: number,
  end: "touchcancel" | "touchend" = "touchend",
): Promise<void> {
  await touch(page, [
    ["touchstart", from],
    ["touchmove", to],
    [end, to],
  ]);
}

/*
 * Desktop browsers don't all expose the Touch constructor, so the handlers -
 * which only ever read touches[0].pageX - are fed a minimal stand-in.
 */
async function touch(
  page: Page,
  moves: Array<[string, number]>,
): Promise<void> {
  await page.evaluate((events) => {
    const image = document.getElementById("ilb-image");
    for (const [type, x] of events) {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, "touches", { value: [{ pageX: x }] });
      image?.dispatchEvent(event);
    }
  }, moves);
}

test("goes to the next image on a swipe to the left", async ({ page }) => {
  await openMiddleImage(page);
  await swipe(page, 300, 100);
  await expectImage(page, "images/demo3.jpg");
});

test("goes to the previous image on a swipe to the right", async ({ page }) => {
  await openMiddleImage(page);
  await swipe(page, 100, 300);
  await expectImage(page, "images/demo1.jpg");
});

test("follows the finger while swiping", async ({ page }) => {
  await openMiddleImage(page);
  await touch(page, [
    ["touchstart", 100],
    ["touchmove", 130],
  ]);
  await expect(currentImage(page)).toHaveCSS("left", "30px");
});

test("ignores a swipe shorter than the threshold", async ({ page }) => {
  await openMiddleImage(page);
  await swipe(page, 100, 130);
  await expectImage(page, "images/demo2.jpg");
  // The image snaps back into place
  await expect(currentImage(page)).toHaveCSS("left", "0px");
});

test("ignores a cancelled swipe", async ({ page }) => {
  await openMiddleImage(page);
  await swipe(page, 300, 100, "touchcancel");
  await expectImage(page, "images/demo2.jpg");
  await expect(currentImage(page)).toHaveCSS("left", "0px");
});
