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
  addToDOM(callback: () => void): void;
  startLoading(onload: () => void, onerror: () => void): void;
  transitionIn(
    transitionDirection: TransitionDirection,
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
    if (wasTouched(event.originalEvent as PointerEvent)) {
      return true;
    }
    const posX =
      (event.pageX || (event.originalEvent as PointerEvent).pageX) -
      (event.target as HTMLImageElement).offsetLeft;
    if ((event.target as HTMLImageElement).width / 3 > posX) {
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
      imageElement.on(
        hasPointers ? "pointerup.ilb7 MSPointerUp.ilb7" : "click.ilb7",
        (e: BaseJQueryEventObject) =>
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

  function reflow(): void {
    const screenWidth = $(window).width()!,
      screenHeight = $(window).height()!,
      gutterFactor = Math.abs(1 - options.gutter / 100);

    const setSizes = (imageWidth: number, imageHeight: number): void => {
      if (imageWidth > screenWidth || imageHeight > screenHeight) {
        const ratio =
          imageWidth / imageHeight > screenWidth / screenHeight
            ? imageWidth / screenWidth
            : imageHeight / screenHeight;
        imageWidth /= ratio;
        imageHeight /= ratio;
      }
      const cssHeight = imageHeight * gutterFactor,
        cssWidth = imageWidth * gutterFactor,
        cssLeft = ($(window).width()! - cssWidth) / 2;

      imageElement.css({
        width: cssWidth.toString() + "px",
        height: cssHeight.toString() + "px",
        left: cssLeft.toString() + "px",
      });
    };

    const videoId = imageElement.data("ilb2VideoId") as string;
    const videoDimensions = videoCache.dimensions(videoId);
    if (videoDimensions !== undefined) {
      setSizes(...videoDimensions);
      return;
    }
    const videoElement = imageElement.get(0) as HTMLVideoElement;
    if ((videoElement.videoWidth as number | undefined) !== undefined) {
      setSizes(videoElement.videoWidth, videoElement.videoHeight);
      return;
    }

    const tmpImage = new Image();
    tmpImage.src = imageElement.attr("src")!;
    tmpImage.onload = (): void => {
      setSizes(tmpImage.width, tmpImage.height);
    };
  }

  function addToDOM(callback: () => void): void {
    getContainer().append(imageElement);
    imageElement.css("opacity", 0);
    reflow();
    $(window).on("resize.ilb7", () => {
      reflow();
    });
    callback();
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
    transitionDirection: TransitionDirection,
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    cssTransitionTranslateX(
      imageElement,
      (-100 * transitionDirection).toString() + "px",
      0.001,
    );
    image.on("transitionend", () => {
      cssTransitionTranslateX(
        imageElement,
        "0px",
        options.animationSpeed / 1000,
      );
    });
    imageElement.animate({ opacity: 1 }, options.animationSpeed, () => {
      onready(callback, previousImage, nextImage, closeLightbox);
    });
  }

  function transitionOut(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    if (transitionDirection !== TransitionDirection.None) {
      cssTransitionTranslateX(
        imageElement,
        (100 * transitionDirection - swipeDiff).toString() + "px",
        options.animationSpeed / 1000,
      );
    }
    imageElement.animate({ opacity: 0 }, options.animationSpeed, (): void => {
      callback();
    });
  }

  function removeFromDOM(): void {
    $(window).off("resize.ilb7");
    imageElement.remove();
  }

  return {
    addToDOM,
    startLoading,
    transitionIn,
    transitionOut,
    removeFromDOM,
  };
}
