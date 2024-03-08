import $ from "jquery";

import type { PreloadedVideo } from "./interfaces/PreloadedVideo";
import type { VideoOptions } from "./interfaces/VideoOptions";

export class VideoCache {
  private readonly videos: Array<PreloadedVideo>;

  public constructor() {
    this.videos = [];
  }

  public addVideos(elements: JQuery): void {
    elements.each((_, element) => {
      this.addVideo($(element));
    });
  }

  public getVideoWidthHeight(videoId: string): [number, number] | undefined {
    const video = this.videos.find((x) => x.i === videoId);
    if (video === undefined) {
      return undefined;
    }
    return [video.w ?? video.e.width()!, video.h ?? video.e.height()!];
  }

  public getVideoElement(videoId: string): [JQuery, boolean] {
    const video = this.videos.find((x) => x.i === videoId)!;
    const element = video.e;
    if (video.a !== undefined) {
      if (video.l) {
        void (element.get(0) as HTMLVideoElement).play();
      } else {
        element.attr("autoplay", video.a);
      }
    }
    return [element, video.l];
  }

  private addVideo(element: JQuery): void {
    const videoOptions = element.data("ilb2Video") as VideoOptions | undefined;
    if (videoOptions === undefined) {
      return;
    }
    let id = element.data("ilb2Id") as string;
    if (!id) {
      // Random id
      id = "a" + (((1 + Math.random()) * 0x10000) | 0).toString(16);
    }
    element.data("ilb2VideoId", id);
    const video: PreloadedVideo = {
      e: $(
        "<video id='ilb-image' preload='metadata' data-ilb2-video-id='" +
          id +
          "'>",
      ),
      i: id,
      l: false,
      a: undefined,
      h: undefined,
      w: undefined,
    };
    $.each(videoOptions, (key: string, value): void => {
      switch (key) {
        case "autoplay":
          video.a = value as string;
          break;
        case "height":
          video.h = value as number;
          break;
        case "width":
          video.w = value as number;
          break;
        case "controls":
        case "loop":
        case "muted":
        case "poster":
        case "preload":
        case "src":
          video.e = video.e.attr(key, value as number | string);
      }
    });
    if (videoOptions.sources) {
      $.each(videoOptions.sources, (_, source): void => {
        let sourceElement = $("<source>");
        $.each(source, (key: string, value): void => {
          sourceElement = sourceElement.attr(key, value!);
        });
        video.e.append(sourceElement);
      });
    }
    video.e.on("loadedmetadata.ilb7", (): void => {
      video.l = true;
    });
    this.videos.push(video);
  }
}
