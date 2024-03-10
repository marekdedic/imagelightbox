import $ from "jquery";

import {
  addActivityIndicatorToDOM,
  removeActivityIndicatorFromDOM,
} from "./activity-indicator";
import { addArrowsToDOM, showArrows } from "./arrows";
import { addCaptionToDOM, setCaption } from "./caption";
import { addCloseButtonToDOM } from "./close-button";
import { removeContainerFromDOM, triggerContainerEvent } from "./container";
import { ImageView } from "./ImageView";
import { addNavigationToDOM } from "./navigation";
import { addOverlayToDOM } from "./overlay";
import { TransitionDirection } from "./TransitionDirection";
import { VideoCache } from "./VideoCache";

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

  // Cached preloaded videos
  private readonly videoCache: VideoCache;

  // The index of the currently open image, or null if the lightbox is closed
  private currentImage: number | null;

  // The currently displayed image view
  private currentImageView: ImageView | null;

  // Whether the lighbox is currently transitioning between images
  //private inTransition: boolean;

  public constructor(options: ILBOptions, set: string, images: JQuery) {
    this.options = options;
    this.set = set;
    this.images = $();
    this.videoCache = new VideoCache();
    this.currentImage = null;
    this.currentImageView = null;
    //this.inTransition = true; // TODO: Really?

    this.addImages(images);
  }

  public getSet(): string {
    return this.set;
  }

  public temp_getImageView(): ImageView | null {
    return this.currentImageView;
  }

  public temp_getVideoCache(): VideoCache {
    return this.videoCache;
  }

  public addImages(images: JQuery): void {
    const validImages = images
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
    this.videoCache.addVideos(validImages);
    this.images.add(validImages);
  }

  public openLightboxWithImage(image: JQuery, container: JQuery): void {
    const index = this.images.index(image);
    if (index < 0) {
      return;
    }
    this.openLightbox(index, container);
  }

  public openLightbox(index: number, container: JQuery): void {
    if (this.options.activity) {
      addActivityIndicatorToDOM(container);
    }
    if (this.options.arrows) {
      addArrowsToDOM(
        container,
        () => {
          this.previousImage(container);
        },
        () => {
          this.nextImage(container);
        },
      );
    }
    if (this.options.caption) {
      addCaptionToDOM(container);
    }
    if (this.options.button) {
      addCloseButtonToDOM(container, () => {
        this.closeLightbox(container);
      });
    }
    if (this.options.navigation) {
      addNavigationToDOM(
        container,
        () => this.images,
        () => this.currentImage!,
        (newIndex: number, direction: TransitionDirection) => {
          this.changeImage(newIndex, direction, container);
        },
      );
    }
    if (this.options.overlay) {
      addOverlayToDOM(container);
    }

    this.startLoadingNewImage(index, TransitionDirection.None, container);
  }

  public closeLightbox(container: JQuery): void {
    if (this.options.activity) {
      addActivityIndicatorToDOM(container);
    }

    this.transitionOutOldImage(TransitionDirection.None, () => {
      this.currentImage = null;
      this.currentImageView = null;
      removeContainerFromDOM();
    });
  }

  public previousImage(container: JQuery): void {
    if (this.currentImage === null) {
      return;
    }

    if (this.currentImage === 0) {
      if (this.options.quitOnEnd) {
        this.closeLightbox(container);
      } else {
        this.changeImage(
          this.images.length - 1,
          TransitionDirection.Left,
          container,
        );
      }
    } else {
      this.changeImage(
        this.currentImage - 1,
        TransitionDirection.Left,
        container,
      );
    }
  }

  public nextImage(container: JQuery): void {
    if (this.currentImage === null) {
      return;
    }

    if (this.currentImage === this.images.length - 1) {
      if (this.options.quitOnEnd) {
        this.closeLightbox(container);
      } else {
        this.changeImage(0, TransitionDirection.Right, container);
      }
    } else {
      this.changeImage(
        this.currentImage + 1,
        TransitionDirection.Right,
        container,
      );
    }
  }

  public changeImage(
    index: number,
    transitionDirection: TransitionDirection,
    container: JQuery,
  ): void {
    if (this.currentImage === null) {
      return;
    }

    if (this.options.activity) {
      addActivityIndicatorToDOM(container);
    }

    this.transitionOutOldImage(transitionDirection);
    this.startLoadingNewImage(index, transitionDirection, container);
  }

  // Transition functions

  private transitionOutOldImage(
    transitionDirection: TransitionDirection,
    callback?: () => void,
  ): void {
    const oldImageView = this.currentImageView!;
    oldImageView.transitionOut(transitionDirection, () => {
      oldImageView.removeFromDOM();
      callback?.();
    });
  }

  private startLoadingNewImage(
    newIndex: number,
    transitionDirection: TransitionDirection,
    container: JQuery,
  ): void {
    const newImageView = new ImageView(
      this.images.eq(newIndex),
      this.options,
      this.videoCache,
    );
    newImageView.startLoading(
      () => {
        this.currentImage = newIndex;
        this.currentImageView = newImageView;
        this.addNewImage(transitionDirection, container);
      },
      () => {
        this.endTransitionIn();
      },
    );
  }

  private addNewImage(
    transitionDirection: TransitionDirection,
    container: JQuery,
  ): void {
    this.currentImageView?.addToDOM(container, () => {
      const image = this.images.get(this.currentImage!)!;
      setCaption(
        image.dataset.ilb2Caption ?? $(image).find("img").attr("alt") ?? null,
      );
      this.transitionInNewImage(transitionDirection, container);
      if (
        this.options.preloadNext &&
        this.currentImage! + 1 < this.images.length
      ) {
        const nextImage = this.images.eq(this.currentImage! + 1);
        $("<img />").attr("src", nextImage.attr("href")!);
      }
      triggerContainerEvent("loaded.ilb2");
    });
  }

  private transitionInNewImage(
    transitionDirection: TransitionDirection,
    container: JQuery,
  ): void {
    this.currentImageView?.transitionIn(
      transitionDirection,
      () => {
        this.endTransitionIn();
      },
      () => {
        this.previousImage(container);
      },
      () => {
        this.nextImage(container);
      },
      () => {
        this.closeLightbox(container);
      },
    );
  }

  private endTransitionIn(): void {
    removeActivityIndicatorFromDOM();
    showArrows();
  }
}
