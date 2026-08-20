/*
 * Entry point for the test fixtures page. Anything that only exists to be
 * driven by the Playwright tests belongs here rather than in index.ts, so that
 * the docs page stays free of test orchestration.
 */

import { ImageLightbox } from "./lib/imagelightbox";
import "./lib/css.d";

declare const TEST: boolean | undefined;
const isTest: boolean = typeof TEST === "undefined" ? false : TEST;

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="no-keyboard"]'),
  {
    enableKeyboard: false,
    ...(isTest && { animationSpeed: 0 }),
  },
);

const dynamicNavigationGallery = new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="dynamic-navigation"]'),
  {
    navigation: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);
document
  .getElementsByClassName("add_image_navigation")
  .item(0)
  ?.addEventListener("click", () => {
    const linkContainer = document
      .getElementsByClassName("demo_dynamic_navigation")
      .item(0);
    const newLi = document.createElement("li");
    linkContainer?.appendChild(newLi);

    const newAnchor = document.createElement("a");
    newAnchor.dataset["imagelightbox"] = "dynamic-navigation";
    newAnchor.href = "images/demo3.jpg";
    newLi.appendChild(newAnchor);

    const newImg = document.createElement("img");
    newImg.src = "images/thumb3.jpg";
    newAnchor.appendChild(newImg);

    dynamicNavigationGallery.addImages(
      document.querySelectorAll('a[data-imagelightbox="dynamic-navigation"]'),
    );
  });

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="autoplay-video"]'),
  {
    ...(isTest && { animationSpeed: 0 }),
  },
);

const programmaticGallery = new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="programmatic"]'),
  {
    ...(isTest && { animationSpeed: 0 }),
  },
);
const onClick = (className: string, handler: () => void): void => {
  document
    .getElementsByClassName(className)
    .item(0)
    ?.addEventListener("click", handler);
};
onClick("programmatic_open", () => {
  programmaticGallery.open();
});
onClick("programmatic_open_third", () => {
  const third = document.querySelectorAll<HTMLAnchorElement>(
    'a[data-imagelightbox="programmatic"]',
  )[2];
  programmaticGallery.open(third);
});
onClick("programmatic_open_foreign", () => {
  // An image that belongs to a different gallery must be rejected
  const foreign = document.querySelector<HTMLAnchorElement>(
    'a[data-imagelightbox="no-keyboard"]',
  );
  if (foreign !== null) {
    programmaticGallery.open(foreign);
  }
});
onClick("programmatic_previous", () => {
  programmaticGallery.previous();
});
onClick("programmatic_next", () => {
  programmaticGallery.next();
});
onClick("programmatic_close", () => {
  programmaticGallery.close();
});

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="caption-fallback"]'),
  {
    caption: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);

// A gallery whose selector matches nothing must not blow up
new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="no-such-gallery"]'),
  {
    ...(isTest && { animationSpeed: 0 }),
  },
);
