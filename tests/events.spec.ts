import type { Page } from "@playwright/test";

import { expect, test } from "playwright-test-coverage";

import { expectImage } from "./helpers";

const ILB_EVENTS = [
  "ilb:start",
  "ilb:quit",
  "ilb:loaded",
  "ilb:previous",
  "ilb:next",
  "ilb:error",
];

function collectEvents(page: Page): Array<string> {
  const events: Array<string> = [];
  page.on("console", (message) => {
    const text = message.text();
    if (ILB_EVENTS.includes(text)) {
      events.push(text);
    }
  });
  return events;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: "tests/init.ts",
  });
});

test("fires start and loaded events when opening", async ({ page }) => {
  const events = collectEvents(page);
  await page.goto("/");
  await page.getByTestId("events").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect.poll(() => events).toStrictEqual(["ilb:start", "ilb:loaded"]);
});

test("fires next and previous events when navigating", async ({ page }) => {
  const events = collectEvents(page);
  await page.goto("/");
  await page.getByTestId("events").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await expect.poll(() => events).toStrictEqual(["ilb:start", "ilb:loaded"]);
  await page.keyboard.press("ArrowRight");
  await expectImage(page, "images/demo2.jpg");
  await expect
    .poll(() => events)
    .toStrictEqual(["ilb:start", "ilb:loaded", "ilb:next", "ilb:loaded"]);
  await page.keyboard.press("ArrowLeft");
  await expectImage(page, "images/demo1.jpg");
  await expect
    .poll(() => events)
    .toStrictEqual([
      "ilb:start",
      "ilb:loaded",
      "ilb:next",
      "ilb:loaded",
      "ilb:previous",
      "ilb:loaded",
    ]);
});

test("fires a quit event when closing", async ({ page }) => {
  const events = collectEvents(page);
  await page.goto("/");
  await page.getByTestId("events").getByRole("link").first().click();
  await expect(page.locator("#ilb-image")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-image")).toBeHidden();
  await expect.poll(() => events).toContain("ilb:quit");
});

test("fires an error event for an image that fails to load", async ({
  page,
}) => {
  const events = collectEvents(page);
  await page.goto("/");
  await page.getByTestId("events").getByRole("link").nth(3).click();
  await expect.poll(() => events).toStrictEqual(["ilb:start", "ilb:error"]);
  // The image never loads, so it is never shown and the spinner is taken down
  await expect(page.locator("#ilb-image")).toHaveCount(0);
  await expect(page.locator("#ilb-activity-indicator")).toBeHidden();
  // The lightbox is still usable afterwards
  await page.keyboard.press("Escape");
  await expect(page.locator("#ilb-container")).toBeHidden();
});
