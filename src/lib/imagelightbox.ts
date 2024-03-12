import $ from "jquery";

import { openHistory } from "./history";
import { State } from "./State";

$.fn.imageLightbox = function (opts?: Partial<ILBOptions>): JQuery {
  const options: ILBOptions = $.extend(
    {
      allowedTypes: "png|jpg|jpeg|gif",
      animationSpeed: 250,
      activity: false,
      arrows: false,
      button: false,
      caption: false,
      enableKeyboard: true,
      history: false,
      fullscreen: false,
      gutter: 10, // percentage of client height
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
  const state = new State(
    options,
    $(this).data("imagelightbox") as string | undefined,
    $(this),
  );

  this.addToImageLightbox = (elements: JQuery): void => {
    state.addImages(elements);
  };

  this.openHistory = (): void => {
    if (options.history) {
      openHistory(state);
    }
  };

  this.openHistory();

  this.loadPreviousImage = (): void => {
    state.previousImage();
  };

  this.loadNextImage = (): void => {
    state.nextImage();
  };

  this.quitImageLightbox = function (): JQuery {
    state.closeLightbox();
    return this;
  };

  this.startImageLightbox = (image?: JQuery): void => {
    if (image !== undefined) {
      state.openLightboxWithImage(image);
    } else {
      state.openLightbox(0);
    }
  };

  return this;
};
