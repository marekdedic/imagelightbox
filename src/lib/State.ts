import $ from "jquery";

import { addCaptionToDOM, setCaption } from "./caption";
import { addOverlayToDOM } from "./overlay";

/**
 * The lightbox state.
 *
 * The most important part of the State is managing the transition lifecycle. When transitioning between images, the lifecycle takes the following steps:
 *
 * 1. Start loading the new image and start visually transitioning the old image out (startTransition)
 * 2a. When the old image is visually transitioned out, it is removed (removeOldImage)
 * 2b. When the new image is loaded, it starts visually transitioning in (addNewImage)
 * 3. Once the new image is in the right place, the transition ends (transitionEnd)
 */
export class State {
  // The lightbox options
  private readonly options: ILBOptions;

  // The value of data-imagelightbox on the images
  private readonly set: string;

  // The clickable images in the lightbox
  private images: JQuery;

  // The index of the currently open image, or null if the lightbox is closed
  private currentImage: number | null;

  // Whether the lighbox is currently transitioning between images
  //private inTransition: boolean;

  public constructor(options: ILBOptions, set: string, images: JQuery) {
    this.options = options;
    this.set = set;
    this.images = $();
    this.currentImage = null;
    //this.inTransition = true; // TODO: Really?

    this.addImages(images);
  }

  public getSet(): string {
    return this.set;
  }

  public addImages(images: JQuery): void {
    images
      .filter(
        (_, element): boolean =>
          element.tagName.toLowerCase() === "a" &&
          (new RegExp(".(" + this.options.allowedTypes + ")$", "i").test(
            (element as HTMLAnchorElement).href,
          ) ||
            element.dataset.ilb2Video !== undefined),
      )
      .each((_, element): void => {
        this.images = this.images.add(element);
      });
    this.images = images;
  }

  public openLightboxWithImage(image: JQuery, container: JQuery): void {
    const index = this.images.index(image);
    if (index < 0) {
      return;
    }
    this.openLightbox(index, container);
  }

  public openLightbox(index: number, container: JQuery): void {
    if (this.options.caption) {
      addCaptionToDOM(container);
    }
    if (this.options.overlay) {
      addOverlayToDOM(container);
    }

    this.startTransition(index);
  }

  public closeLightbox(): void {
    this.currentImage = null;
  }

  public changeImage(index: number): void {
    if (this.currentImage === null) {
      return;
    }
    this.startTransition(index);
  }

  public previousImage(): void {
    if (this.currentImage === null) {
      return;
    }

    if (this.currentImage === 0) {
      if (this.options.quitOnEnd) {
        this.closeLightbox();
      } else {
        this.changeImage(this.images.length - 1);
      }
    } else {
      this.changeImage(this.currentImage - 1);
    }
  }

  public nextImage(): void {
    if (this.currentImage === null) {
      return;
    }

    if (this.currentImage === this.images.length - 1) {
      if (this.options.quitOnEnd) {
        this.closeLightbox();
      } else {
        this.changeImage(0);
      }
    } else {
      this.changeImage(this.currentImage + 1);
    }
  }

  private startTransition(index: number): void {
    this.currentImage = index;

    // TODO: Only call these later
    this.removeOldImage();
    this.addNewImage();
  }

  private removeOldImage(): void {}

  private addNewImage(): void {
    const image = this.images.get(this.currentImage!)!;
    setCaption(
      image.dataset.ilb2Caption ?? $(image).find("img").attr("alt") ?? null,
    );

    // TODO: Only call this later
    this.endTransition();
  }

  private endTransition(): void {}
}
