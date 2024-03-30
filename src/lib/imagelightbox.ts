import $ from "jquery";

import { openHistory } from "./history";
import { State } from "./State";

$.fn.imageLightbox = function (opts?: Partial<ILBOptions>): JQuery {
  const options: ILBOptions = $.extend(
    {
      activity: false,
      allowedTypes: "png|jpg|jpeg|gif",
      animationSpeed: 250,
      arrows: false,
      button: false,
      caption: false,
      enableKeyboard: true,
      history: false,
      fullscreen: false,
      gutter: 10,
      navigation: false,
      overlay: false,
      preloadNext: true,
      quitOnEnd: false,
      quitOnImgClick: false,
      quitOnDocClick: true,
      quitOnEscKey: true,
    },
    opts,
  );
  const state = State(
    options,
    $(this).data("imagelightbox") as string | undefined,
    $(this),
  );

  this.addToImageLightbox = (elements: JQuery): void => {
    state.addImages(elements);
  };

  this.openHistory = (): void => {
    if (options.history) {
      openHistory(
        state.set(),
        state.images().get() as Array<HTMLAnchorElement>,
        (index: number, skipHistory?: boolean) => {
          state.open(index, skipHistory);
        },
      );
    }
  };

  this.openHistory();

  this.loadPreviousImage = (): void => {
    state.previous();
  };

  this.loadNextImage = (): void => {
    state.next();
  };

  this.quitImageLightbox = function (): JQuery {
    state.close();
    return this;
  };

  this.startImageLightbox = (image?: JQuery): void => {
    if (image !== undefined) {
      state.openWithImage(image);
    } else {
      state.open(0);
    }
  };

  return this;
};
