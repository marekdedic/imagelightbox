import type { VideoOptions } from "./interfaces/VideoOptions";

export interface PreloadedVideo {
  element(): [HTMLVideoElement, boolean];
  id(): string;
  shouldAutoplay(): boolean;
}

export function PreloadedVideo(
  image: HTMLAnchorElement,
  videoOptions: VideoOptions,
): PreloadedVideo {
  let tempId = image.dataset["ilb2Id"];
  // Random id
  tempId ??= `a${(((1 + Math.random()) * 0x10000) | 0).toString(16)}`;
  image.dataset["ilb2VideoId"] = tempId;
  const videoId = tempId;

  const videoElement = document.createElement("video");
  videoElement.setAttribute("id", "ilb-image");
  videoElement.preload = "metadata";
  videoElement.dataset["ilb2VideoId"] = videoId;
  let isLoaded = false;
  let autoplay = false;

  for (const [key, value] of Object.entries(videoOptions)) {
    switch (key) {
      case "autoplay":
        autoplay = true;
        break;
      case "controls":
      case "loop":
      case "muted":
      case "poster":
      case "preload":
      case "src":
        videoElement.setAttribute(key, (value as number | string).toString());
        break;
      default:
    }
  }
  if (videoOptions.sources) {
    for (const source of videoOptions.sources) {
      const sourceElement = document.createElement("source");
      for (const [key, value] of Object.entries(source)) {
        sourceElement.setAttribute(key, value as string);
      }
      videoElement.appendChild(sourceElement);
    }
  }
  videoElement.addEventListener("loadedmetadata", () => {
    isLoaded = true;
  });

  function id(): string {
    return videoId;
  }

  function element(): [HTMLVideoElement, boolean] {
    return [videoElement, isLoaded];
  }

  function shouldAutoplay(): boolean {
    return autoplay;
  }

  return {
    element,
    id,
    shouldAutoplay,
  };
}
