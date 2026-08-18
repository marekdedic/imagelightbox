import { expect, type Locator, type Page } from "@playwright/test";

/**
 * The container is a modal dialog, so while the lightbox is open the page behind
 * it is inert and its buttons cannot be clicked for real. Clicking them from a
 * script stands in for the surrounding application driving the lightbox.
 */
export async function clickThroughModal(
  page: Page,
  selector: string,
): Promise<void> {
  await page.evaluate((target) => {
    document.querySelector<HTMLButtonElement>(target)?.click();
  }, selector);
}

/**
 * The lightbox keeps the outgoing image in the DOM until its transition
 * finishes, so `#ilb-image` briefly matches two elements. The incoming image is
 * appended last, which makes `.last()` the reliable way to look at it.
 */
export function currentImage(page: Page): Locator {
  return page.locator("#ilb-image").last();
}

export async function expectImage(page: Page, src: string): Promise<void> {
  await expect(currentImage(page)).toHaveAttribute("src", src);
  await expect(page.locator("#ilb-image")).toHaveCount(1);
}

/**
 * The image click and swipe handlers are only attached once the image has
 * transitioned in, which there is no observable signal for.
 */
export async function settle(): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}
