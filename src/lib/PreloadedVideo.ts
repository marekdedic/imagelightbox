import $ from "jquery";

import type { VideoOptions } from "./interfaces/VideoOptions";

export class PreloadedVideo {
  public readonly id: string;
  private readonly element: JQuery;
  private isLoaded: boolean;
  private autoplay: boolean;
  private height: number | undefined;
  private width: number | undefined;

  public constructor(element: JQuery, videoOptions: VideoOptions) {
    let id = element.data("ilb2Id") as string | undefined;
    if (id === undefined) {
      // Random id
      id = "a" + (((1 + Math.random()) * 0x10000) | 0).toString(16);
    }
    element.data("ilb2VideoId", id);

    this.id = id;
    this.id = id;
    this.element = $(
      "<video id='ilb-image' preload='metadata' data-ilb2-video-id='" +
        id +
        "'>",
    );
    this.isLoaded = false;
    this.autoplay = false;
    this.height = undefined;
    this.width = undefined;

    $.each(videoOptions, (key: string, value): void => {
      switch (key) {
        case "autoplay":
          this.autoplay = true;
          break;
        case "height":
          this.height = value as number;
          break;
        case "width":
          this.width = value as number;
          break;
        case "controls":
        case "loop":
        case "muted":
        case "poster":
        case "preload":
        case "src":
          this.element.attr(key, value as number | string);
      }
    });
    if (videoOptions.sources) {
      $.each(videoOptions.sources, (_, source): void => {
        let sourceElement = $("<source>");
        $.each(source, (key: string, value): void => {
          sourceElement = sourceElement.attr(key, value!);
        });
        this.element.append(sourceElement);
      });
    }
    this.element.on("loadedmetadata.ilb7", (): void => {
      this.isLoaded = true;
    });
  }

  public getVideoWidthHeight(): [number, number] {
    return [
      this.width ?? this.element.width()!,
      this.height ?? this.element.height()!,
    ];
  }

  public getVideoElement(): [JQuery, boolean] {
    if (this.autoplay) {
      if (this.isLoaded) {
        void (this.element.get(0) as HTMLVideoElement).play();
      } else {
        this.element.attr("autoplay", "autoplay");
      }
    }
    return [this.element, this.isLoaded];
  }
}
