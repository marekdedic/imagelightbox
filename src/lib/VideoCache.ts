import type { VideoOptions } from "./interfaces/VideoOptions";
import { PreloadedVideo } from "./PreloadedVideo";

export interface VideoCache {
  add(elements: Array<HTMLAnchorElement>): void;
  dimensions(videoId: string): [number, number] | undefined;
  element(videoId: string): [HTMLVideoElement, boolean];
}

export function VideoCache(): VideoCache {
  const videos: Array<PreloadedVideo> = [];

  function add(elements: Array<HTMLAnchorElement>): void {
    for (const image of elements) {
      const videoOptions = image.dataset.ilb2Video;
      if (videoOptions === undefined) {
        continue;
      }
      videos.push(
        PreloadedVideo(image, JSON.parse(videoOptions) as VideoOptions),
      );
    }
  }

  function dimensions(videoId: string): [number, number] | undefined {
    const video = videos.find((x) => x.id() === videoId);
    if (video === undefined) {
      return undefined;
    }
    return video.dimensions();
  }

  function element(videoId: string): [HTMLVideoElement, boolean] {
    const video = videos.find((x) => x.id() === videoId)!;
    return video.element();
  }

  return {
    add,
    dimensions,
    element,
  };
}
