import $ from "jquery";

import {
  addActivityIndicatorToDOM,
  removeActivityIndicatorFromDOM,
} from "./activity-indicator";
import { addArrowsToDOM, showArrows } from "./arrows";
import { addCaptionToDOM, setCaption } from "./caption";
import { addCloseButtonToDOM } from "./close-button";
import {
  addContainerToDOM,
  getContainer,
  removeContainerFromDOM,
  triggerContainerEvent,
} from "./container";
import { popHistory, pushQuitToHistory, pushToHistory } from "./history";
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
  private readonly set: string | undefined;

  // The clickable images in the lightbox
  private images: JQuery;

  // Cached preloaded videos
  private readonly videoCache: VideoCache;

  // The imagelightbox container element
  private readonly container: JQuery;

  // The index of the currently open image, or null if the lightbox is closed
  private currentImage: number | null;

  // The currently displayed image view
  private currentImageView: ImageView | null;

  public constructor(
    options: ILBOptions,
    set: string | undefined,
    images: JQuery,
  ) {
    this.options = options;
    this.set = set;
    this.images = $();
    this.videoCache = new VideoCache();
    this.container = getContainer();
    this.currentImage = null;
    this.currentImageView = null;

    this.addImages(images);

    if (this.options.history) {
      $(window).on("popstate.ilb7", (event: BaseJQueryEventObject) => {
        popHistory(event, this);
      });
    }
  }

  public getSet(): string | undefined {
    return this.set;
  }

  public getImages(): JQuery {
    return this.images;
  }

  public getCurrentIndex(): number | null {
    return this.currentImage;
  }

  public temp_getImageView(): ImageView | null {
    return this.currentImageView;
  }

  public addImages(images: JQuery): void {
    const validImages = images.filter(
      (_, element): boolean =>
        element.tagName.toLowerCase() === "a" &&
        (new RegExp(".(" + this.options.allowedTypes + ")$", "i").test(
          (element as HTMLAnchorElement).href,
        ) ||
          element.dataset.ilb2Video !== undefined),
    );
    this.videoCache.addVideos(validImages);
    this.images = this.images.add(validImages);
    validImages.on("click.ilb7", (event: BaseJQueryEventObject) => {
      event.preventDefault();
      this.openLightboxWithImage($(event.delegateTarget as HTMLElement));
    });
  }

  public openLightboxWithImage(image: JQuery): void {
    const index = this.images.index(image);
    if (index < 0) {
      return;
    }
    this.openLightbox(index);
  }

  public openLightbox(index: number, skipHistory = false): void {
    $("body").addClass("ilb-open");
    addContainerToDOM();
    if (this.options.activity) {
      addActivityIndicatorToDOM(this.container);
    }
    if (this.options.arrows) {
      addArrowsToDOM(
        this.container,
        () => {
          this.previousImage();
        },
        () => {
          this.nextImage();
        },
      );
    }
    if (this.options.caption) {
      addCaptionToDOM(this.container);
    }
    if (this.options.button) {
      addCloseButtonToDOM(this.container, () => {
        this.closeLightbox();
      });
    }
    if (this.options.navigation) {
      addNavigationToDOM(
        this.container,
        () => this.images,
        () => this.currentImage!,
        (newIndex: number, direction: TransitionDirection) => {
          this.changeImage(newIndex, direction);
        },
      );
    }
    if (this.options.overlay) {
      addOverlayToDOM(this.container);
    }

    if (this.options.history && !skipHistory) {
      pushToHistory(index, this);
    }

    triggerContainerEvent("start.ilb2", this.images.eq(index));
    this.startLoadingNewImage(index, TransitionDirection.None);
  }

  public closeLightbox(skipHistory = false): void {
    if (this.options.activity) {
      addActivityIndicatorToDOM(this.container);
    }

    if (this.options.history && !skipHistory) {
      pushQuitToHistory();
    }

    triggerContainerEvent("quit.ilb2");

    this.transitionOutOldImage(TransitionDirection.None, () => {
      this.currentImage = null;
      this.currentImageView = null;
      removeContainerFromDOM();
      $("body").removeClass("ilb-open");
    });
  }

  public previousImage(): void {
    if (this.currentImage === null) {
      return;
    }

    let newIndex = this.currentImage - 1;
    if (this.currentImage === 0) {
      if (this.options.quitOnEnd) {
        this.closeLightbox();
        return;
      } else {
        newIndex = this.images.length - 1;
      }
    }
    triggerContainerEvent("previous.ilb2", this.images.eq(newIndex));
    this.changeImage(newIndex, TransitionDirection.Left);
  }

  public nextImage(): void {
    if (this.currentImage === null) {
      return;
    }

    let newIndex = this.currentImage + 1;
    if (this.currentImage === this.images.length - 1) {
      if (this.options.quitOnEnd) {
        this.closeLightbox();
        return;
      } else {
        newIndex = 0;
      }
    }
    triggerContainerEvent("next.ilb2", this.images.eq(newIndex));
    this.changeImage(newIndex, TransitionDirection.Right);
  }

  public changeImage(
    index: number,
    transitionDirection: TransitionDirection,
    skipHistory = false,
  ): void {
    if (this.currentImage === null) {
      return;
    }

    if (this.options.history && !skipHistory) {
      pushToHistory(index, this);
    }

    if (this.options.activity) {
      addActivityIndicatorToDOM(this.container);
    }

    this.transitionOutOldImage(transitionDirection);
    this.startLoadingNewImage(index, transitionDirection);
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
        this.addNewImage(transitionDirection);
      },
      () => {
        this.endTransitionIn();
      },
    );
  }

  private addNewImage(transitionDirection: TransitionDirection): void {
    this.currentImageView?.addToDOM(this.container, () => {
      const image = this.images.get(this.currentImage!)!;
      setCaption(
        image.dataset.ilb2Caption ?? $(image).find("img").attr("alt") ?? null,
      );
      this.transitionInNewImage(transitionDirection);
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

  private transitionInNewImage(transitionDirection: TransitionDirection): void {
    this.currentImageView?.transitionIn(
      transitionDirection,
      () => {
        this.endTransitionIn();
      },
      () => {
        this.previousImage();
      },
      () => {
        this.nextImage();
      },
      () => {
        this.closeLightbox();
      },
    );
  }

  private endTransitionIn(): void {
    removeActivityIndicatorFromDOM();
    showArrows();
  }
}
