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
    $(this).get() as Array<HTMLAnchorElement>,
  );

  this.addToImageLightbox = (elements: JQuery): void => {
    state.addImages(elements.get() as Array<HTMLAnchorElement>);
  };

  this.openHistory = (): void => {
    if (options.history) {
      openHistory(
        state.set(),
        state.images(),
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
      state.openWithImage(image.get(0)! as HTMLAnchorElement);
    } else {
      state.open(0);
    }
  };

  return this;
};

const doc = $(document);
doc.on("ilb:start", (e) => {
  $("#ilb-container").trigger("start.ilb2", e.target);
});
doc.on("ilb:quit", () => {
  $("#ilb-container").trigger("quit.ilb2");
});
doc.on("ilb:loaded", () => {
  $("#ilb-container").trigger("loaded.ilb2");
});
doc.on("ilb:previous", (e) => {
  $("#ilb-container").trigger("previous.ilb2", e.target);
});
doc.on("ilb:next", (e) => {
  $("#ilb-container").trigger("next.ilb2", e.target);
});
