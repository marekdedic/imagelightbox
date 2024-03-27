import "./ImageView.css";

import $ from "jquery";

import { getContainer } from "./container";
import { TransitionDirection } from "./TransitionDirection";
import type { VideoCache } from "./VideoCache";

function cssTransitionTranslateX(
  element: JQuery,
  positionX: string,
  speed: number,
): void {
  element.css({
    transform: "translateX(" + positionX + ") translateY(-50%)",
    transition: "transform " + speed.toString() + "s ease-in",
  });
}

const hasTouch = "ontouchstart" in window;
const hasPointers = "PointerEvent" in window;
function wasTouched(event: PointerEvent): boolean {
  if (hasTouch) {
    return true;
  }

  if (!hasPointers || typeof event.pointerType === "undefined") {
    return false;
  }

  if (event.pointerType !== "mouse") {
    return true;
  }

  return false;
}

// TODO: Refactor
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
  image: JQuery,
  options: ILBOptions,
  videoCache: VideoCache,
): ImageView {
  let swipeStart = 0;
  let swipeDiff = 0;
  let imageElement: JQuery = $('<img id="ilb-image" />').attr(
    "src",
    image.attr("href")!,
  );
  const containerElement: JQuery = $(
    '<div class="ilb-image-container">',
  ).append(imageElement);
  let isVideoPreloaded: boolean | undefined = undefined;

  const isVideo = image.data("ilb2Video") !== undefined;
  if (isVideo) {
    [imageElement, isVideoPreloaded] = videoCache.element(
      image.data("ilb2VideoId") as string,
    );
  }

  function onclick(
    event: BaseJQueryEventObject,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): boolean {
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
    if (!isVideo && !("ontouchstart" in window)) {
      imageElement.on("click.ilb7", (e: BaseJQueryEventObject) =>
        onclick(e, previousImage, nextImage, closeLightbox),
      );
    }
    imageElement
      .on(
        "touchstart.ilb7 pointerdown.ilb7 MSPointerDown.ilb7",
        (e: BaseJQueryEventObject): void => {
          if (
            !wasTouched(e.originalEvent as PointerEvent) ||
            options.quitOnImgClick
          ) {
            return;
          }
          swipeStart =
            (e.originalEvent as PointerEvent).pageX ||
            (e.originalEvent as TouchEvent).touches[0].pageX;
        },
      )
      .on(
        "touchmove.ilb7 pointermove.ilb7 MSPointerMove.ilb7",
        (e: BaseJQueryEventObject): void => {
          if (
            (!hasPointers && e.type === "pointermove") ||
            !wasTouched(e.originalEvent as PointerEvent) ||
            options.quitOnImgClick
          ) {
            return;
          }
          const swipeEnd =
            (e.originalEvent as PointerEvent).pageX ||
            (e.originalEvent as TouchEvent).touches[0].pageX;
          swipeDiff = swipeStart - swipeEnd;
          cssTransitionTranslateX(
            imageElement,
            (-swipeDiff).toString() + "px",
            0,
          );
        },
      )
      .on(
        "touchend.ilb7 touchcancel.ilb7 pointerup.ilb7 pointercancel.ilb7 MSPointerUp.ilb7 MSPointerCancel.ilb7",
        (e): boolean => {
          if (
            !wasTouched(e.originalEvent as PointerEvent) ||
            options.quitOnImgClick
          ) {
            return true;
          }
          if (swipeDiff < -50) {
            previousImage();
            return false;
          }
          if (swipeDiff > 50) {
            nextImage();
            return false;
          }
          cssTransitionTranslateX(
            imageElement,
            "0px",
            options.animationSpeed / 1000,
          );
          return true;
        },
      );
    callback();
  }

  function addToDOM(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    getContainer().append(containerElement);
    const maxSize = Math.abs(100 - options.gutter);
    imageElement.css({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- CSS property
      "max-height": maxSize.toString() + "%",
      // eslint-disable-next-line @typescript-eslint/naming-convention -- CSS property
      "max-width": maxSize.toString() + "%",
      left: (-100 * transitionDirection).toString() + "px",
      transition: "left ease " + options.animationSpeed.toString() + "ms",
      opacity: "0",
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
    imageElement.css("left", "0");
    imageElement.animate({ opacity: 1 }, options.animationSpeed, () => {
      onready(callback, previousImage, nextImage, closeLightbox);
    });
  }

  function transitionOut(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    if (transitionDirection !== TransitionDirection.None) {
      imageElement.css("left", (100 * transitionDirection).toString() + "px");
    }
    imageElement.animate({ opacity: 0 }, options.animationSpeed, (): void => {
      callback();
    });
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
