import "./imagelightbox.css";

import $ from "jquery";

import {
  addContainerToDOM,
  removeContainerFromDOM,
  temp_getContainer,
  triggerContainerEvent,
} from "./container";
import {
  openHistory,
  popHistory,
  pushQuitToHistory,
  pushToHistory,
} from "./history";
import { ImageView } from "./ImageView";
import { State } from "./State";
import { TransitionDirection } from "./TransitionDirection";
import { VideoCache } from "./VideoCache";

const hasTouch = "ontouchstart" in window;
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
    $(this).data("imagelightbox") as string,
    $(this),
  );
  let imageView: ImageView | null = null;
  let inProgress = false; // Whether a transition is in progress
  let target = $(); // targets.eq(targetIndex)
  let targetIndex = -1; // The index of the currently open image in its set (targets). -1 if the lightbox isn't open
  let targets: JQuery = $([]); // Clickable images
  const videoCache = new VideoCache();
  const _removeImage = (): void => {
      imageView?.removeFromDOM();
      imageView = null;
    },
    _quitImageLightbox = (noHistory = false): void => {
      state.closeLightbox();
      targetIndex = -1;
      if (!noHistory && options.history) {
        pushQuitToHistory();
      }
      triggerContainerEvent("quit.ilb2");
      $("body").removeClass("ilb-open");
      imageView?.transitionOut(TransitionDirection.None, () => {
        _removeImage();
        inProgress = false;
        removeContainerFromDOM();
      });
    },
    _previousTarget = (): void => {
      state.previousImage(temp_getContainer());
      if (inProgress) {
        return;
      }

      targetIndex--;
      if (targetIndex < 0) {
        if (options.quitOnEnd) {
          _quitImageLightbox();
          return;
        } else {
          targetIndex = targets.length - 1;
        }
      }
      target = targets.eq(targetIndex);
      if (options.history) {
        pushToHistory(targets, targetIndex);
      }
      triggerContainerEvent("previous.ilb2", target);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Cyclical dependency
      _loadImage(TransitionDirection.Left);
    },
    _nextTarget = (): void => {
      state.nextImage(temp_getContainer());
      if (inProgress) {
        return;
      }

      targetIndex++;
      if (targetIndex >= targets.length) {
        if (options.quitOnEnd) {
          _quitImageLightbox();
          return;
        } else {
          targetIndex = 0;
        }
      }
      if (options.history) {
        pushToHistory(targets, targetIndex);
      }
      target = targets.eq(targetIndex);
      triggerContainerEvent("next.ilb2", target);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Cyclical dependency
      _loadImage(TransitionDirection.Right);
    },
    _loadImage = (direction: TransitionDirection): void => {
      if (inProgress) {
        return;
      }

      imageView?.transitionOut(direction, () => {
        _removeImage();
      });

      inProgress = true;

      setTimeout((): void => {
        function onload(): void {
          imageView?.addToDOM(temp_getContainer(), () => {
            imageView?.transitionIn(
              direction,
              () => {
                inProgress = false;
              },
              _previousTarget,
              _nextTarget,
              _quitImageLightbox,
            );
            if (options.preloadNext) {
              let nextTarget = targets.eq(targets.index(target) + 1);
              if (!nextTarget.length) {
                nextTarget = targets.eq(0);
              }
              $("<img />").attr("src", nextTarget.attr("href")!);
            }
            triggerContainerEvent("loaded.ilb2");
          });
        }
        imageView = new ImageView(target, options, videoCache);
        imageView.startLoading(onload, () => {});
      }, options.animationSpeed + 100);
    },
    _openImageLightbox = ($target: JQuery, noHistory: boolean): void => {
      state.openLightboxWithImage($target, temp_getContainer());
      if (inProgress) {
        return;
      }
      inProgress = false;
      target = $target;
      targetIndex = targets.index(target);
      if (!noHistory && options.history) {
        pushToHistory(targets, targetIndex);
      }
      addContainerToDOM();
      $("body").addClass("ilb-open");
      triggerContainerEvent("start.ilb2", $target);
      _loadImage(TransitionDirection.None);
    },
    isTargetValid = (element: JQuery): boolean =>
      (($(element).prop("tagName") as string).toLowerCase() === "a" &&
        new RegExp(".(" + options.allowedTypes + ")$", "i").test(
          $(element).attr("href")!,
        )) ||
      $(element).data("ilb2Video") !== undefined,
    _addTargets = function (newTargets: JQuery): void {
      function filterTargets(): void {
        newTargets
          .filter(function (): boolean {
            return isTargetValid($(this));
          })
          .each(function (): void {
            targets = targets.add($(this));
          });
      }
      newTargets.each(function (): void {
        targets = newTargets.add($(this));
      });
      newTargets.on("click.ilb7", function (e): void {
        e.preventDefault();
        filterTargets();
        if (targets.length < 1) {
          _quitImageLightbox();
        } else {
          _openImageLightbox($(this), false);
        }
      });
    };

  if (options.history) {
    $(window).on("popstate", (event: BaseJQueryEventObject) => {
      popHistory(
        event,
        targets,
        state,
        targetIndex,
        _openImageLightbox,
        _quitImageLightbox,
        (
          newTarget: JQuery,
          newIndex: number,
          transitionDirection: TransitionDirection,
        ) => {
          target = newTarget;
          targetIndex = newIndex;
          _loadImage(transitionDirection);
        },
      );
    });
  }

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
    if (options.quitOnDocClick) {
      $(document).on(hasTouch ? "touchend.ilb7" : "click.ilb7", (e): void => {
        if (imageView !== null && !$(e.target).is(imageView.temp_getImage())) {
          e.preventDefault();
          _quitImageLightbox();
        }
      });
    }

    if (options.fullscreen && hasFullscreenSupport) {
      $(document).on("keydown.ilb7", (e): void => {
        if (imageView === null) {
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
        if (imageView === null) {
          return;
        }
        if ([27].includes(e.which!) && options.quitOnEscKey) {
          e.stopPropagation();
          e.preventDefault();
          _quitImageLightbox();
        }
        if ([37].includes(e.which!)) {
          e.stopPropagation();
          e.preventDefault();
          _previousTarget();
        }
        if ([39].includes(e.which!)) {
          e.stopPropagation();
          e.preventDefault();
          _nextTarget();
        }
      });
    }
  });

  this.addToImageLightbox = (elements: JQuery): void => {
    state.addImages(elements);
    _addTargets(elements);
    videoCache.addVideos(elements);
  };

  this.addToImageLightbox($(this));

  this.openHistory = (): void => {
    if (options.history) {
      openHistory(
        targets,
        state,
        (index: number) => {
          targetIndex = index;
        },
        (element: JQuery, noHistory: boolean) => {
          _openImageLightbox(element, noHistory);
        },
      );
    }
  };

  this.openHistory();

  this.loadPreviousImage = (): void => {
    _previousTarget();
  };

  this.loadNextImage = (): void => {
    _nextTarget();
  };

  this.quitImageLightbox = function (): JQuery {
    _quitImageLightbox();
    return this;
  };

  this.startImageLightbox = function (element?: JQuery): void {
    if (element) {
      element.trigger("click.ilb7");
    } else {
      $(this).trigger("click.ilb7");
    }
  };

  return this;
};
