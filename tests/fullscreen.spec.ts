import type { Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

interface FullscreenRecorder {
  ilbFullscreenCalls: Array<string>;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

/**
 * Headless browsers refuse to actually enter fullscreen, so the fullscreen API
 * is faked to record which element the lightbox asks to make fullscreen. The
 * fake is installed on the container itself, so it has to be set up after the
 * lightbox has been opened.
 */
async function fakeFullscreenAPI(page: Page): Promise<void> {
  await page.evaluate(() => {
    const recorder = globalThis as unknown as FullscreenRecorder;
    recorder.ilbFullscreenCalls = [];
    const container = document.getElementById("ilb-container");
    let currentElement: Element | null = null;
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => currentElement,
    });
    if (container !== null) {
      // The lightbox discards the returned promise, so the stubs don't need one
      container.requestFullscreen = ((): void => {
        recorder.ilbFullscreenCalls.push(`request:${container.id}`);
        currentElement = container;
      }) as () => Promise<void>;
    }
    // eslint-disable-next-line compat/compat -- Only overwriting the fullscreen API for the test
    document.exitFullscreen = ((): void => {
      recorder.ilbFullscreenCalls.push("exit");
      currentElement = null;
    }) as () => Promise<void>;
  });
}

async function fullscreenCalls(page: Page): Promise<Array<string>> {
  return await page.evaluate(
    () => (globalThis as unknown as FullscreenRecorder).ilbFullscreenCalls,
  );
}

test("makes the container fullscreen and back with the fullscreen button", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-fullscreen-button")).toBeVisible();
  await fakeFullscreenAPI(page);

  await page.locator("#ilb-fullscreen-button").click();
  await expect
    .poll(async () => await fullscreenCalls(page))
    .toStrictEqual(["request:ilb-container"]);

  // A second click leaves fullscreen instead of requesting it again
  await page.locator("#ilb-fullscreen-button").click();
  await expect
    .poll(async () => await fullscreenCalls(page))
    .toStrictEqual(["request:ilb-container", "exit"]);
});

test("keeps the lightbox open when clicking the fullscreen button", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await fakeFullscreenAPI(page);
  // The button click must not bubble up to the quitOnDocClick handler
  await page.locator("#ilb-fullscreen-button").click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect(page.locator("#ilb-image")).toHaveAttribute(
    "src",
    "images/demo1.jpg",
  );
});

test("removes the fullscreen button when the lightbox closes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("basic").getByRole("link").first().click();
  await expect(page.locator("#ilb-fullscreen-button")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-fullscreen-button")).toHaveCount(0);
});
