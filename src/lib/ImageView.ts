import "./ImageView.css";

import $ from "jquery";

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

export class ImageView {
  private readonly imageElement: JQuery;
  private swipeStart: number;
  private swipeDiff: number;
  private readonly isVideo: boolean;
  private readonly isVideoPreloaded: boolean | undefined;

  private readonly options: ILBOptions;
  private readonly videoCache: VideoCache;

  public constructor(
    image: JQuery,
    options: ILBOptions,
    videoCache: VideoCache,
  ) {
    this.options = options;
    this.videoCache = videoCache;

    this.swipeStart = 0;
    this.swipeDiff = 0;

    this.isVideo = image.data("ilb2Video") !== undefined;
    if (this.isVideo) {
      [this.imageElement, this.isVideoPreloaded] = videoCache.element(
        image.data("ilb2VideoId") as string,
      );
    } else {
      this.imageElement = $('<img id="ilb-image" />').attr(
        "src",
        image.attr("href")!,
      );
    }
  }

  public addToDOM(container: JQuery, callback: () => void): void {
    this.imageElement.appendTo(container);
    this.imageElement.css("opacity", 0);
    this.reflow();
    $(window).on("resize.ilb7", () => {
      this.reflow();
    });
    callback();
  }

  public startLoading(onload: () => void, onerror: () => void): void {
    this.imageElement.on("error.ilb7", onerror);
    if (this.isVideoPreloaded === true) {
      onload();
    } else {
      this.imageElement
        .on("load.ilb7", onload)
        .on("loadedmetadata.ilb7", onload);
    }
  }

  public transitionIn(
    transitionDirection: TransitionDirection,
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    cssTransitionTranslateX(
      this.imageElement,
      (-100 * transitionDirection).toString() + "px",
      0,
    );
    setTimeout((): void => {
      cssTransitionTranslateX(
        this.imageElement,
        "0px",
        this.options.animationSpeed / 1000,
      );
    }, 50);
    this.imageElement.animate(
      { opacity: 1 },
      this.options.animationSpeed,
      () => {
        this.onready(callback, previousImage, nextImage, closeLightbox);
      },
    );
  }

  public transitionOut(
    transitionDirection: TransitionDirection,
    callback: () => void,
  ): void {
    if (transitionDirection !== TransitionDirection.None) {
      cssTransitionTranslateX(
        this.imageElement,
        (100 * transitionDirection - this.swipeDiff).toString() + "px",
        this.options.animationSpeed / 1000,
      );
    }
    this.imageElement.animate(
      { opacity: 0 },
      this.options.animationSpeed,
      (): void => {
        callback();
      },
    );
  }

  public removeFromDOM(): void {
    $(window).off("resize.ilb7");
    this.imageElement.remove();
  }

  private reflow(): void {
    const screenWidth = $(window).width()!,
      screenHeight = $(window).height()!,
      gutterFactor = Math.abs(1 - this.options.gutter / 100);

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

      this.imageElement.css({
        width: cssWidth.toString() + "px",
        height: cssHeight.toString() + "px",
        left: cssLeft.toString() + "px",
      });
    };

    const videoId = this.imageElement.data("ilb2VideoId") as string;
    const videoDimensions = this.videoCache.dimensions(videoId);
    if (videoDimensions !== undefined) {
      setSizes(...videoDimensions);
      return;
    }
    const videoElement = this.imageElement.get(0) as HTMLVideoElement;
    if ((videoElement.videoWidth as number | undefined) !== undefined) {
      setSizes(videoElement.videoWidth, videoElement.videoHeight);
      return;
    }

    const tmpImage = new Image();
    tmpImage.src = this.imageElement.attr("src")!;
    tmpImage.onload = (): void => {
      setSizes(tmpImage.width, tmpImage.height);
    };
  }

  private onclick(
    event: BaseJQueryEventObject,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): boolean {
    if (this.options.quitOnImgClick) {
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

  private onready(
    callback: () => void,
    previousImage: () => void,
    nextImage: () => void,
    closeLightbox: () => void,
  ): void {
    if (!this.isVideo) {
      this.imageElement.on(
        hasPointers ? "pointerup.ilb7 MSPointerUp.ilb7" : "click.ilb7",
        (e: BaseJQueryEventObject) =>
          this.onclick(e, previousImage, nextImage, closeLightbox),
      );
    }
    this.imageElement
      .on(
        "touchstart.ilb7 pointerdown.ilb7 MSPointerDown.ilb7",
        (e: BaseJQueryEventObject): void => {
          if (
            !wasTouched(e.originalEvent as PointerEvent) ||
            this.options.quitOnImgClick
          ) {
            return;
          }
          this.swipeStart =
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
            this.options.quitOnImgClick
          ) {
            return;
          }
          const swipeEnd =
            (e.originalEvent as PointerEvent).pageX ||
            (e.originalEvent as TouchEvent).touches[0].pageX;
          this.swipeDiff = this.swipeStart - swipeEnd;
          cssTransitionTranslateX(
            this.imageElement,
            (-this.swipeDiff).toString() + "px",
            0,
          );
        },
      )
      .on(
        "touchend.ilb7 touchcancel.ilb7 pointerup.ilb7 pointercancel.ilb7 MSPointerUp.ilb7 MSPointerCancel.ilb7",
        (e): boolean => {
          if (
            !wasTouched(e.originalEvent as PointerEvent) ||
            this.options.quitOnImgClick
          ) {
            return true;
          }
          if (this.swipeDiff < -50) {
            previousImage();
            return false;
          }
          if (this.swipeDiff > 50) {
            nextImage();
            return false;
          }
          cssTransitionTranslateX(
            this.imageElement,
            "0px",
            this.options.animationSpeed / 1000,
          );
          return true;
        },
      );
    callback();
  }
}
