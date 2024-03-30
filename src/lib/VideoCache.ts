import $ from "jquery";

import type { VideoOptions } from "./interfaces/VideoOptions";
import { PreloadedVideo } from "./PreloadedVideo";

export interface VideoCache {
  add(elements: JQuery): void;
  dimensions(videoId: string): [number, number] | undefined;
  element(videoId: string): [HTMLVideoElement, boolean];
}

export function VideoCache(): VideoCache {
  const videos: Array<PreloadedVideo> = [];

  function add(elements: JQuery): void {
    elements.each((_, image) => {
      const videoOptions = $(image).data("ilb2Video") as
        | VideoOptions
        | undefined;
      if (videoOptions === undefined) {
        return;
      }
      videos.push(PreloadedVideo(image as HTMLAnchorElement, videoOptions));
    });
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
