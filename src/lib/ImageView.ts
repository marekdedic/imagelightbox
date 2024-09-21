import type { VideoCache } from "./VideoCache";

import { getContainer } from "./container";
import "./ImageView.css";
import { TransitionDirection } from "./TransitionDirection";

export interface ImageView {
  addToDOM(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void;
  removeFromDOM(): void;
  startLoading(onload: () => void, onerror: () => void): void;
  transitionIn(
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void;
  transitionOut(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void;
}

export function ImageView(
  image: HTMLAnchorElement,
  options: ILBOptions,
  videoCache: VideoCache,
): ImageView {
  let swipeStart = 0;
  let swipeDiff = 0;
  let imageElement: HTMLImageElement | HTMLVideoElement =
    document.createElement("img");
  imageElement.setAttribute("id", "ilb-image");
  imageElement.setAttribute("src", image.getAttribute("href") ?? "");
  const containerElement = document.createElement("div");
  containerElement.classList.add("ilb-image-container");
  let isVideoPreloaded: boolean | undefined = undefined;

  const videoId = image.dataset["ilb2VideoId"];
  let isVideo =
    image.dataset["ilb2Video"] !== undefined && videoId !== undefined;
  if (isVideo) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Checked by the if above
    const videoElement = videoCache.element(videoId!);
    if (videoElement !== undefined) {
      [imageElement, isVideoPreloaded] = videoElement;
    } else {
      isVideo = false;
    }
  }
  containerElement.appendChild(imageElement);

  function onready(
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    if (!isVideo) {
      (imageElement as HTMLImageElement).addEventListener("click", (e) => {
        e.stopPropagation();
        if (options.quitOnImgClick) {
          closeLightbox();
          return;
        }
        const xPosRelativeToImage =
          (e.pageX - imageElement.offsetLeft) / imageElement.width;
        if (xPosRelativeToImage <= 1 / 3) {
          previousImage();
        } else {
          nextImage();
        }
      });
    }
    imageElement.addEventListener("touchstart", (e) => {
      swipeStart = (e as TouchEvent).touches[0].pageX;
      imageElement.style.transitionProperty = "opacity";
    });
    imageElement.addEventListener("touchmove", (e) => {
      swipeDiff = (e as TouchEvent).touches[0].pageX - swipeStart;
      imageElement.style.left = `${swipeDiff.toString()}px`;
    });
    imageElement.addEventListener("touchend", (e) => {
      e.stopPropagation();
      imageElement.style.transitionProperty = "left, opacity";
      if (swipeDiff > 50) {
        previousImage();
      }
      if (swipeDiff < -50) {
        nextImage();
      }
      imageElement.style.left = "0";
    });
    imageElement.addEventListener("touchcancel", (e) => {
      e.stopPropagation();
      imageElement.style.transitionProperty = "left, opacity";
      imageElement.style.left = "0";
    });
    callback();
  }

  function addToDOM(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    getContainer().appendChild(containerElement);
    const maxSize = Math.abs(100 - options.gutter);
    imageElement.style.maxHeight = `${maxSize.toString()}%`;
    imageElement.style.maxWidth = `${maxSize.toString()}%`;
    imageElement.style.left = `${(-100 * transitionDirection).toString()}px`;
    imageElement.style.transition = `all ease ${options.animationSpeed.toString()}ms`;
    setTimeout(callback, 50);
  }

  function startLoading(onload: () => void, onerror: () => void): void {
    imageElement.addEventListener("error", onerror);
    if (isVideoPreloaded === true) {
      onload();
    } else {
      imageElement.addEventListener("load", onload);
      imageElement.addEventListener("loadedmetadata", onload);
    }
  }

  function transitionIn(
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    imageElement.style.left = "0";
    imageElement.style.opacity = "1";
    setTimeout(() => {
      onready(callback, previousImage, nextImage, closeLightbox);
    }, options.animationSpeed);
  }

  function transitionOut(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    if (transitionDirection !== TransitionDirection.None) {
      const currentLeft = parseInt(imageElement.style.left, 10) || 0;
      imageElement.style.left = `${(currentLeft + 100 * transitionDirection).toString()}px`;
    }
    imageElement.style.opacity = "0";
    setTimeout(() => {
      callback();
    }, options.animationSpeed);
  }

  function removeFromDOM(): void {
    containerElement.remove();
  }

  return {
    addToDOM,
    removeFromDOM,
    startLoading,
    transitionIn,
    transitionOut,
  };
}
