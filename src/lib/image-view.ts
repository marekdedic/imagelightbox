import "./image-view.css";

import $ from "jquery";

import type { PreloadedVideo } from "./interfaces/PreloadedVideo";
import { TransitionDirection } from "./TransitionDirection";

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

function reflowImageView(
  imageView: JQuery,
  videos: () => Array<PreloadedVideo>,
  options: ILBOptions,
): void {
  const screenWidth = $(window).width()!,
    screenHeight = $(window).height()!,
    gutterFactor = Math.abs(1 - options.gutter / 100);

  function setSizes(imageWidth: number, imageHeight: number): void {
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

    imageView.css({
      width: cssWidth.toString() + "px",
      height: cssHeight.toString() + "px",
      left: cssLeft.toString() + "px",
    });
  }

  const videoId = imageView.data("ilb2VideoId") as string;
  let videoHasDimensions = false;
  $.each(videos(), function (_, video) {
    if (videoId === this.i) {
      setSizes(video.w ?? video.e.width()!, video.h ?? video.e.height()!);
      videoHasDimensions = true;
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TypeScript can't detect possible overwrite in a loop
  if (videoHasDimensions) {
    return;
  }
  const videoElement = imageView.get(0) as HTMLVideoElement;
  if ((videoElement.videoWidth as number | undefined) !== undefined) {
    setSizes(videoElement.videoWidth, videoElement.videoHeight);
    return;
  }

  const tmpImage = new Image();
  tmpImage.src = imageView.attr("src")!;
  tmpImage.onload = (): void => {
    setSizes(tmpImage.width, tmpImage.height);
  };
}

export function startLoadingImageView(
  imageView: JQuery,
  callback: () => void,
): void {
  // TODO .on("error.ilb7")
  imageView.on("load.ilb7", callback).on("loadedmetadata.ilb7", callback);
}

export function addImageViewToDOM(
  imageView: JQuery,
  container: JQuery,
  options: ILBOptions,
  videos: () => Array<PreloadedVideo>,
  callback: () => void,
): void {
  imageView.appendTo(container);
  imageView.css("opacity", 0);
  reflowImageView(imageView, videos, options);
  $(window).on("resize.ilb7", () => {
    reflowImageView(imageView, videos, options);
  });
  callback();
}

export function transitionInImageView(
  imageView: JQuery,
  transitionDirection: TransitionDirection,
  options: ILBOptions,
  callback: () => void,
): void {
  cssTransitionTranslateX(
    imageView,
    (-100 * transitionDirection).toString() + "px",
    0,
  );
  setTimeout((): void => {
    cssTransitionTranslateX(imageView, "0px", options.animationSpeed / 1000);
  }, 50);
  imageView.animate({ opacity: 1 }, options.animationSpeed, callback);
}

export function transitionOutImageView(
  imageView: JQuery,
  transitionDirection: TransitionDirection,
  options: ILBOptions,
  callback: () => void,
  temp_swipeDiff = 0,
): void {
  if (transitionDirection !== TransitionDirection.None) {
    cssTransitionTranslateX(
      imageView,
      (100 * transitionDirection - temp_swipeDiff).toString() + "px",
      options.animationSpeed / 1000,
    );
  }
  imageView.animate({ opacity: 0 }, options.animationSpeed, (): void => {
    callback();
  });
}

export function removeImageViewFromDOM(imageView: JQuery): void {
  $(window).off("resize.ilb7");
  imageView.remove();
}
