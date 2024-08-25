import {
  addActivityIndicatorToDOM,
  removeActivityIndicatorFromDOM,
} from "./activity-indicator";
import { addArrowsToDOM, removeArrowsFromDOM } from "./arrows";
import { setCaption } from "./caption";
import { addCloseButtonToDOM, removeCloseButtonFromDOM } from "./close-button";
import {
  addContainerToDOM,
  darkenOverlay,
  getContainer,
  removeContainerFromDOM,
  transitionOutContainer,
} from "./container";
import { popHistory, pushQuitToHistory, pushToHistory } from "./history";
import { ImageView } from "./ImageView";
import {
  addKeyboardNavigation,
  removeKeyboardNavigation,
} from "./keyboard-navigation";
import {
  addNavigationItems,
  addNavigationToDOM,
  changeNavigationCurrent,
} from "./navigation";
import { TransitionDirection } from "./TransitionDirection";
import { VideoCache } from "./VideoCache";

export interface State {
  addImages(images: Array<HTMLAnchorElement>): void;
  close(skipHistory?: boolean): void;
  images(): Array<HTMLAnchorElement>;
  next(): void;
  open(index: number, skipHistory?: boolean): void;
  openWithImage(image: HTMLAnchorElement): void;
  previous(): void;
  set(): string | undefined;
}

export function State(
  // The lightbox options
  options: ILBOptions,
  // The value of data-imagelightbox on the images
  lightboxSet: string | undefined,
  initialImages: Array<HTMLAnchorElement>,
): State {
  // The clickable images in the lightbox
  const targetImages: Array<HTMLAnchorElement> = [];

  // Cached preloaded videos
  const videoCache: VideoCache = VideoCache();

  // The index of the currently open image, or null if the lightbox is closed
  let currentImage: number | null = null;

  // The currently displayed image view
  let currentImageView: ImageView | null = null;

  // !!! State initialization is at the bottom!

  function set(): string | undefined {
    return lightboxSet;
  }

  function images(): Array<HTMLAnchorElement> {
    return targetImages;
  }

  /**
   * The lightbox transition functions.
   *
   * The most important part of the State is managing the transition lifecycle. When transitioning between images, the lifecycle takes the following steps:
   *
   * For transitioning out an old image:
   *
   * 1. Start visually transitioning the old image out (slide + fade out)
   * 2. When the image is visually gone, actually remove it from the DOM
   *
   * For transitioning in a new image:
   *
   * 1. Start loading the new image in the background (startLoadingNewImage)
   * 2. When the new image is loaded, add it to the DOM, but keep it invisible (addNewImage)
   * 3. After adding the image to the DOM, transition it into place - slide + fade in (transitionInNewImage)
   */

  function removeOldImage(
    transitionDirection: TransitionDirection,
    callback?: () => void,
  ): void {
    const oldImageView = currentImageView!;
    oldImageView.transitionOut(transitionDirection, () => {
      oldImageView.removeFromDOM();
      callback?.();
    });
  }

  function transitionInNewImage(): void {
    currentImageView?.transitionIn(
      removeActivityIndicatorFromDOM,
      /* eslint-disable @typescript-eslint/no-use-before-define -- Cyclical dependencies */
      previous,
      next,
      close,
      /* eslint-enable */
    );
  }

  function addNewImage(transitionDirection: TransitionDirection): void {
    currentImageView?.addToDOM(transitionDirection, () => {
      const image = targetImages[currentImage!];
      if (options.caption) {
        setCaption(
          image.dataset.ilb2Caption ??
            image.getElementsByTagName("img").item(0)?.alt ??
            "",
          options.animationSpeed,
        );
      }
      transitionInNewImage();
      if (options.preloadNext && currentImage! + 1 < targetImages.length) {
        const nextImage = targetImages[currentImage! + 1];
        const nextImageElement = document.createElement("img");
        nextImageElement.setAttribute(
          "src",
          nextImage.getAttribute("href") ?? "",
        );
      }
      getContainer().dispatchEvent(new Event("ilb:loaded", { bubbles: true }));
    });
  }

  function startLoadingNewImage(
    newIndex: number,
    transitionDirection: TransitionDirection,
  ): void {
    const newImageView = ImageView(targetImages[newIndex], options, videoCache);
    newImageView.startLoading(
      () => {
        currentImage = newIndex;
        currentImageView = newImageView;
        addNewImage(transitionDirection);
      },
      () => {
        removeActivityIndicatorFromDOM();
      },
    );
  }

  // Public functions wrapping the state transition functions

  function close(skipHistory = false): void {
    if (currentImage === null) {
      return;
    }
    if (options.activity) {
      addActivityIndicatorToDOM();
    }

    removeKeyboardNavigation();

    if (options.history && !skipHistory) {
      pushQuitToHistory();
    }

    getContainer().dispatchEvent(new Event("ilb:quit", { bubbles: true }));

    transitionOutContainer();
    removeOldImage(TransitionDirection.None, () => {
      currentImage = null;
      currentImageView = null;
      removeArrowsFromDOM();
      removeCloseButtonFromDOM();
      removeContainerFromDOM();
    });
  }

  function change(
    index: number,
    transitionDirection: TransitionDirection,
    skipHistory = false,
  ): void {
    if (currentImage === null) {
      return;
    }

    if (options.history && !skipHistory) {
      pushToHistory(index, set(), images());
    }

    if (options.activity) {
      addActivityIndicatorToDOM();
    }
    changeNavigationCurrent(index);

    removeOldImage(transitionDirection);
    startLoadingNewImage(index, transitionDirection);
  }

  function previous(): void {
    if (currentImage === null) {
      return;
    }

    let newIndex = currentImage - 1;
    if (currentImage === 0) {
      if (options.quitOnEnd) {
        close();
        return;
      }
      newIndex = targetImages.length - 1;
    }
    targetImages[newIndex].dispatchEvent(
      new Event("ilb:previous", { bubbles: true }),
    );
    change(newIndex, TransitionDirection.Left);
  }

  function next(): void {
    if (currentImage === null) {
      return;
    }

    let newIndex = currentImage + 1;
    if (currentImage === targetImages.length - 1) {
      if (options.quitOnEnd) {
        close();
        return;
      }
      newIndex = 0;
    }
    targetImages[newIndex].dispatchEvent(
      new Event("ilb:next", { bubbles: true }),
    );
    change(newIndex, TransitionDirection.Right);
  }

  function open(index: number, skipHistory = false): void {
    addContainerToDOM(options.animationSpeed, options.quitOnDocClick, close);
    if (options.activity) {
      addActivityIndicatorToDOM();
    }
    addKeyboardNavigation(options, close, previous, next);
    if (options.arrows) {
      addArrowsToDOM(previous, next);
    }
    if (options.button) {
      addCloseButtonToDOM(close);
    }
    if (options.navigation) {
      addNavigationToDOM(
        images(),
        () => currentImage,
        change,
        options.animationSpeed,
      );
    }
    if (options.overlay) {
      darkenOverlay();
    }

    if (options.history && !skipHistory) {
      pushToHistory(index, set(), images());
    }

    targetImages[index].dispatchEvent(
      new Event("ilb:start", { bubbles: true }),
    );
    startLoadingNewImage(index, TransitionDirection.None);
  }

  function openWithImage(image: HTMLAnchorElement): void {
    const index = targetImages.indexOf(image);
    if (index < 0) {
      return;
    }
    open(index);
  }

  function addImages(newImages: Array<HTMLAnchorElement>): void {
    const validImages = newImages
      .filter((x) => !targetImages.includes(x))
      .filter(
        (element): boolean =>
          element.tagName.toLowerCase() === "a" &&
          (new RegExp(`.(${options.allowedTypes})$`, "i").test(element.href) ||
            element.dataset.ilb2Video !== undefined),
      );
    videoCache.add(validImages);
    targetImages.push(...validImages);
    for (const image of validImages) {
      image.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openWithImage(image);
      });
    }
    addNavigationItems(
      validImages,
      () => currentImage,
      change,
      options.animationSpeed,
    );
  }

  // State initialization

  addImages(initialImages);

  if (options.history) {
    window.addEventListener("popstate", (e) => {
      popHistory(e, set(), images(), currentImage, open, close, change);
    });
  }

  return {
    set,
    images,
    addImages,
    openWithImage,
    open,
    close,
    previous,
    next,
  };
}
