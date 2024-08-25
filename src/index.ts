import { ImageLightbox } from "./lib/imagelightbox";

declare const TEST: boolean | undefined;
const isTest: boolean = typeof TEST !== "undefined" ? TEST : false;

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="a"]'), {
  activity: true,
});

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="allowedtypes"]'),
  {
    allowedTypes: "gif",
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="b"]'), {
  overlay: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="c"]'), {
  button: true,
  quitOnDocClick: false,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="d"]'), {
  caption: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="e"]'), {
  navigation: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="f"]'), {
  arrows: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="quit"]'), {
  quitOnEnd: true,
  quitOnImgClick: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="fullscreen"]'),
  {
    fullscreen: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="g"]'), {
  activity: true,
  arrows: true,
  button: true,
  caption: true,
  navigation: true,
  overlay: true,
  quitOnDocClick: false,
  ...(isTest && { animationSpeed: 0 }),
});

const manualOpenGallery = new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="h"]'),
  {
    arrows: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);
document
  .getElementsByClassName("trigger_lightbox")
  .item(0)!
  .addEventListener("click", () => {
    manualOpenGallery.open();
  });

const dynamicAddingGallery = new ImageLightbox(
  document.querySelectorAll('a[data-imagelightbox="i"]'),
  {
    arrows: true,
    ...(isTest && { animationSpeed: 0 }),
  },
);
document
  .getElementsByClassName("add_image")
  .item(0)!
  .addEventListener("click", () => {
    const linkContainer = document
      .getElementsByClassName("demo_dynamic")
      .item(0)!;
    const newLi = document.createElement("li");
    linkContainer.appendChild(newLi);

    const newAnchor = document.createElement("a");
    newAnchor.dataset.imagelightbox = "i";
    newAnchor.href = "images/demo4.jpg";
    newLi.appendChild(newAnchor);

    const newImg = document.createElement("img");
    newImg.src = "images/thumb4.jpg";
    newAnchor.appendChild(newImg);

    dynamicAddingGallery.addImages(
      document.querySelectorAll('a[data-imagelightbox="i"]'),
    );
  });

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="j"]'), {
  arrows: true,
  history: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="k"]'), {
  arrows: true,
  history: true,
  ...(isTest && { animationSpeed: 0 }),
});

new ImageLightbox(document.querySelectorAll('a[data-imagelightbox="video"]'), {
  activity: true,
  arrows: true,
  overlay: true,
  ...(isTest && { animationSpeed: 0 }),
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
