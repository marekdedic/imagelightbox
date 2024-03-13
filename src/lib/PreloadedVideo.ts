import $ from "jquery";

import type { VideoOptions } from "./interfaces/VideoOptions";

export interface PreloadedVideo {
  id(): string;
  dimensions(): [number, number];
  element(): [JQuery, boolean];
}

export function PreloadedVideo(
  image: JQuery,
  videoOptions: VideoOptions,
): PreloadedVideo {
  let tempId = image.data("ilb2Id") as string | undefined;
  if (tempId === undefined) {
    // Random id
    tempId = "a" + (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }
  image.data("ilb2VideoId", tempId);
  const videoId = tempId;

  const videoElement = $(
    "<video id='ilb-image' preload='metadata' data-ilb2-video-id='" +
      videoId +
      "'>",
  );
  let isLoaded = false;
  let autoplay = false;
  let height: number | undefined = undefined;
  let width: number | undefined = undefined;

  $.each(videoOptions, (key: string, value): void => {
    switch (key) {
      case "autoplay":
        autoplay = true;
        break;
      case "height":
        height = value as number;
        break;
      case "width":
        width = value as number;
        break;
      case "controls":
      case "loop":
      case "muted":
      case "poster":
      case "preload":
      case "src":
        videoElement.attr(key, value as number | string);
    }
  });
  if (videoOptions.sources) {
    $.each(videoOptions.sources, (_, source): void => {
      let sourceElement = $("<source>");
      $.each(source, (key: string, value): void => {
        sourceElement = sourceElement.attr(key, value!);
      });
      videoElement.append(sourceElement);
    });
  }
  videoElement.on("loadedmetadata.ilb7", (): void => {
    isLoaded = true;
  });

  function id(): string {
    return videoId;
  }

  function dimensions(): [number, number] {
    return [width ?? videoElement.width()!, height ?? videoElement.height()!];
  }

  function element(): [JQuery, boolean] {
    if (autoplay) {
      if (isLoaded) {
        void (videoElement.get(0) as HTMLVideoElement).play();
      } else {
        videoElement.attr("autoplay", "autoplay");
      }
    }
    return [videoElement, isLoaded];
  }

  return {
    id,
    dimensions,
    element,
  };
}
