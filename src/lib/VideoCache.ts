import $ from "jquery";

import type { VideoOptions } from "./interfaces/VideoOptions";
import { PreloadedVideo } from "./PreloadedVideo";

export class VideoCache {
  private readonly videos: Array<PreloadedVideo>;

  public constructor() {
    this.videos = [];
  }

  public addVideos(elements: JQuery): void {
    elements.each((_, element) => {
      const videoOptions = $(element).data("ilb2Video") as
        | VideoOptions
        | undefined;
      if (videoOptions === undefined) {
        return;
      }
      this.videos.push(new PreloadedVideo($(element), videoOptions));
    });
  }

  public getVideoWidthHeight(videoId: string): [number, number] | undefined {
    const video = this.videos.find((x) => x.id === videoId);
    if (video === undefined) {
      return undefined;
    }
    return video.getVideoWidthHeight();
  }

  public getVideoElement(videoId: string): [JQuery, boolean] {
    const video = this.videos.find((x) => x.id === videoId)!;
    return video.getVideoElement();
  }
}
