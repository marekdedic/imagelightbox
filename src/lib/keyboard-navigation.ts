import $ from "jquery";

const fullscreenEnabled: boolean =
  document.fullscreenEnabled ||
  ((document as LegacyDocument).webkitFullscreenEnabled ?? false);

function toggleFullScreen(): void {
  const container = $(".imagelightbox-container").get(0)!;

  /* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Polyfills for very old browsers */
  const requestFullscreen = (): void => {
    void (
      container.requestFullscreen ||
      (container as LegacyHTMLElement).webkitRequestFullScreen
    ).call(container);
  };
  const exitFullScreen = (): void => {
    void (
      document.exitFullscreen ||
      (document as LegacyDocument).webkitExitFullscreen
    ).call(document);
  };
  /* eslint-enable */

  if (
    !document.fullscreenElement &&
    !(document as LegacyDocument).webkitFullscreenElement
  ) {
    requestFullscreen();
  } else {
    exitFullScreen();
  }
}

export function addKeyboardNavigation(
  options: ILBOptions,
  closeLightbox: () => void,
  previousImage: () => void,
  nextImage: () => void,
): void {
  if (options.fullscreen && fullscreenEnabled) {
    $(document).on("keyup.ilb7", (e): boolean => {
      // Keycode 13: Enter
      if (e.which === 13) {
        toggleFullScreen();
        return false;
      }
      return true;
    });
  }

  if (options.enableKeyboard) {
    $(document).on("keyup.ilb7", (e): boolean => {
      // Keycode 27: Escape
      if (options.quitOnEscKey && e.which === 27) {
        closeLightbox();
        return false;
      }
      // Keycode 37: Arrow left
      if (e.which === 37) {
        previousImage();
        return false;
      }
      // Keycode 39: Arrow right
      if (e.which === 39) {
        nextImage();
        return false;
      }
      return true;
    });
  }
}

export function removeKeyboardNavigation(): void {
  $(document).off("keyup.ilb7");
}
