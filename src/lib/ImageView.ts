import "./ImageView.css";

import $ from "jquery";

import { getContainer } from "./container";
import { TransitionDirection } from "./TransitionDirection";
import type { VideoCache } from "./VideoCache";

export interface ImageView {
  addToDOM(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void;
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
  removeFromDOM(): void;
}

export function ImageView(
  image: HTMLAnchorElement,
  options: ILBOptions,
  videoCache: VideoCache,
): ImageView {
  let swipeStart = 0;
  let swipeDiff = 0;
  let imageElement: JQuery = $('<img id="ilb-image" />').attr(
    "src",
    $(image).attr("href")!,
  );
  const containerElement: JQuery = $(
    '<div class="ilb-image-container">',
  ).append(imageElement);
  let isVideoPreloaded: boolean | undefined = undefined;

  const isVideo = $(image).data("ilb2Video") !== undefined;
  if (isVideo) {
    let rawImageElement = undefined;
    [rawImageElement, isVideoPreloaded] = videoCache.element(
      $(image).data("ilb2VideoId") as string,
    );
    imageElement = $(rawImageElement);
  }

  function onclick(
    event: BaseJQueryEventObject,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): boolean {
    if (event.type === "touchend") {
      return false;
    }
    if (options.quitOnImgClick) {
      closeLightbox();
      return false;
    }
    const target = event.target as HTMLImageElement;
    const xPosRelativeToImage =
      (event.pageX - target.offsetLeft) / target.width;
    if (xPosRelativeToImage <= 1 / 3) {
      previousImage();
    } else {
      nextImage();
    }
    return false;
  }

  function onready(
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    if (!isVideo) {
      imageElement.on("click.ilb7 touchend.ilb7", (e: BaseJQueryEventObject) =>
        onclick(e, previousImage, nextImage, closeLightbox),
      );
    }
    imageElement
      .on("touchstart.ilb7", (e: BaseJQueryEventObject): void => {
        swipeStart = (e.originalEvent as TouchEvent).touches[0].pageX;
        imageElement.css("transition-property", "opacity");
      })
      .on("touchmove.ilb7", (e: BaseJQueryEventObject): void => {
        swipeDiff =
          (e.originalEvent as TouchEvent).touches[0].pageX - swipeStart;
        imageElement.css("left", swipeDiff.toString() + "px");
      })
      .on("touchend.ilb7 touchcancel.ilb7", (): boolean => {
        imageElement.css("transition-property", "left, opacity");
        if (swipeDiff > 50) {
          previousImage();
          return false;
        }
        if (swipeDiff < -50) {
          nextImage();
          return false;
        }
        imageElement.css("left", "0");
        return true;
      });
    callback();
  }

  function addToDOM(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    $(getContainer()).append(containerElement);
    const maxSize = Math.abs(100 - options.gutter);
    imageElement.css({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- CSS property
      "max-height": maxSize.toString() + "%",
      // eslint-disable-next-line @typescript-eslint/naming-convention -- CSS property
      "max-width": maxSize.toString() + "%",
      left: (-100 * transitionDirection).toString() + "px",
      transition: "all ease " + options.animationSpeed.toString() + "ms",
    });
    imageElement.show(callback);
  }

  function startLoading(onload: () => void, onerror: () => void): void {
    imageElement.on("error.ilb7", onerror);
    if (isVideoPreloaded === true) {
      onload();
    } else {
      imageElement.on("load.ilb7", onload).on("loadedmetadata.ilb7", onload);
    }
  }

  function transitionIn(
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    imageElement.css({
      left: "0",
      opacity: "1",
    });
    setTimeout(() => {
      onready(callback, previousImage, nextImage, closeLightbox);
    }, options.animationSpeed);
  }

  function transitionOut(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    if (transitionDirection !== TransitionDirection.None) {
      const currentLeft = parseInt(imageElement.css("left"), 10) || 0;
      imageElement.css(
        "left",
        (currentLeft + 100 * transitionDirection).toString() + "px",
      );
    }
    imageElement.css("opacity", "0");
    setTimeout(() => {
      callback();
    }, options.animationSpeed);
  }

  function removeFromDOM(): void {
    containerElement.remove();
  }

  return {
    addToDOM,
    startLoading,
    transitionIn,
    transitionOut,
    removeFromDOM,
  };
}
