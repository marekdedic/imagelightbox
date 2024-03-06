import $ from "jquery";

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

  public openLightboxWithImage(image: JQuery): void {
    const index = this.images.index(image);
    if (index < 0) {
      return;
    }
    this.openLightbox(index);
  }

  public openLightbox(index: number): void {
    this.currentImage = index;
  }

  public closeLightbox(): void {
    this.currentImage = null;
  }

  public changeImage(index: number): void {
    if (this.currentImage === null) {
      return;
    }
    // TODO: Check quiting and wrapping
    this.currentImage = index;
  }

  public previousImage(): void {
    if (this.currentImage === null) {
      return;
    }
    // TODO: Check quiting and wrapping
    this.changeImage(this.currentImage - 1);
  }

  public nextImage(): void {
    if (this.currentImage === null) {
      return;
    }
    // TODO: Check quiting and wrapping
    this.changeImage(this.currentImage + 1);
  }
}
