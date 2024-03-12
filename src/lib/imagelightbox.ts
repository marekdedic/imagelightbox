import $ from "jquery";

import { openHistory } from "./history";
import { State } from "./State";

const legacyDocument = document as LegacyDocument;
const hasFullscreenSupport: boolean =
  legacyDocument.fullscreenEnabled ||
  (legacyDocument.webkitFullscreenEnabled ?? false);

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

  function toggleFullScreen(): void {
    const doc = window.document as LegacyDocument;
    const docEl = document.getElementById("ilb-image")!
      .parentElement as LegacyHTMLElement;

    /* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/unbound-method -- Polyfills for very old browsers */
    const requestFullScreen =
      docEl.requestFullscreen || docEl.webkitRequestFullScreen;
    const exitFullScreen = doc.exitFullscreen || doc.webkitExitFullscreen;
    /* eslint-enable */

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      void requestFullScreen.call(docEl);
    } else {
      void exitFullScreen.call(doc);
    }
  }

  $((): void => {
    if (options.fullscreen && hasFullscreenSupport) {
      $(document).on("keydown.ilb7", (e): void => {
        if (state.temp_getImageView() === null) {
          return;
        }
        if ([9, 32, 38, 40].includes(e.which!)) {
          e.stopPropagation();
          e.preventDefault();
        }
        if ([13].includes(e.which!)) {
          e.stopPropagation();
          e.preventDefault();
          toggleFullScreen();
        }
      });
    }

    if (options.enableKeyboard) {
      $(document).on("keydown.ilb7", (e): void => {
        if (state.temp_getImageView() === null) {
          return;
        }
        if ([27].includes(e.which!) && options.quitOnEscKey) {
          e.stopPropagation();
          e.preventDefault();
          state.closeLightbox();
        }
        if ([37].includes(e.which!)) {
          e.stopPropagation();
          e.preventDefault();
          state.previousImage();
        }
        if ([39].includes(e.which!)) {
          e.stopPropagation();
          e.preventDefault();
          state.nextImage();
        }
      });
    }
  });

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
