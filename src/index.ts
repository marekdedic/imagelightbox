import { ImageLightbox } from "./lib/imagelightbox";

declare const TEST: boolean | undefined;
const isTest: boolean = typeof TEST !== "undefined" ? TEST : false;

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="basic"]'), {
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="responsive"]'),
  {
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="video"]'), {
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="minimal"]'),
  {
    activity: false,
    arrows: false,
    button: false,
    fullscreen: false,
    overlay: false,
    quitOnDocClick: false,
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="caption"]'),
  {
    caption: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="navigation"]'),
  {
    navigation: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="quit"]'), {
  quitOnDocClick: false,
  quitOnEnd: false,
  quitOnImgClick: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="history"]'),
  {
    history: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="history-ids"]'),
  {
    history: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="allowedtypes"]'),
  {
    allowedTypes: "gif",
    ...(isTest && { animationSpeed: 0 }),
  },
);

const manualOpenGallery = new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="trigger"]'),
  {
    ...(isTest && { animationSpeed: 0 }),
  },
);
document
  .getElementsByClassName("trigger_lightbox")
  .item(0)
  ?.addEventListener("click", () => {
    manualOpenGallery.open();
  });

const dynamicAddingGallery = new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="dynamic"]'),
  {
    ...(isTest && { animationSpeed: 0 }),
  },
);
document
  .getElementsByClassName("add_image")
  .item(0)
  ?.addEventListener("click", () => {
    const linkContainer = document
      .getElementsByClassName("demo_dynamic")
      .item(0);
    const newLi = document.createElement("li");
    linkContainer?.appendChild(newLi);

    const newAnchor = document.createElement("a");
    newAnchor.dataset["imagelightbox"] = "dynamic";
    newAnchor.href = "images/demo4.jpg";
    newLi.appendChild(newAnchor);

    const newImg = document.createElement("img");
    newImg.src = "images/thumb4.jpg";
    newAnchor.appendChild(newImg);

    dynamicAddingGallery.addImages(
      document.querySelectorAll('a[data-imagelightbox="dynamic"]'),
    );
  });

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="events"]'), {
  ...(isTest && { animationSpeed: 0 }),
});

/* eslint-disable no-console -- This is the docs */
document.addEventListener("ilb:start", (e) => {
  console.log("ilb:start");
  console.log(e.target);
});
document.addEventListener("ilb:quit", () => {
  console.log("ilb:quit");
});
document.addEventListener("ilb:loaded", () => {
  console.log("ilb:loaded");
});
document.addEventListener("ilb:previous", (e) => {
  console.log("ilb:previous");
  console.log(e.target);
});
document.addEventListener("ilb:next", (e) => {
  console.log("ilb:next");
  console.log(e.target);
});
/* eslint-enable no-console */
