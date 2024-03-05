//import $ from "jquery";

export class State {
  // The value of data-imagelightbox on the images
  private readonly set: string;

  // The clickable images in the lightbox
  //private images: JQuery;

  // The index of the currently open image, or null if the lightbox is closed
  //private currentImage: number | null;

  // Whether the lighbox is currently transitioning between images
  //private inTransition: boolean;

  public constructor(set: string, _images: JQuery) {
    this.set = set;
    //this.images = $();
    //this.currentImage = null;
    //this.inTransition = true; // TODO: Really?
    //this.addImages(images);
  }

  /*
  public addImages(images: JQuery): void {
    // TODO: Add some filtering etc.
    this.images = images;
  }
  */

  public getSet(): string {
    return this.set;
  }
}
