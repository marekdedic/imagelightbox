import $ from "jquery";

import { ImageLightbox } from "./ImageLightbox";

$.fn.imageLightbox = function (opts?: Partial<ILBOptions>): JQuery {
  const lightbox = new ImageLightbox(
    this.get() as Array<HTMLAnchorElement>,
    opts,
  );

  this.addToImageLightbox = (elements: JQuery<HTMLAnchorElement>): void => {
    lightbox.addImages(elements.get());
  };

  this.openHistory = (): void => {
    lightbox.openHistory();
  };

  this.loadPreviousImage = (): void => {
    lightbox.previous();
  };

  this.loadNextImage = (): void => {
    lightbox.next();
  };

  this.quitImageLightbox = function (): JQuery {
    lightbox.close();
    return this;
  };

  this.startImageLightbox = (image?: JQuery<HTMLAnchorElement>): void => {
    lightbox.open(image?.get(0));
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
