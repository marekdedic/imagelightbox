import { getContainer } from "./container";

const fullscreenEnabled: boolean =
  // eslint-disable-next-line compat/compat -- The prefixed version fixes the incompatibility
  document.fullscreenEnabled ||
  ((document as LegacyDocument).webkitFullscreenEnabled ?? false);

let keyHandler: ((e: KeyboardEvent) => void) | null = null;

function toggleFullScreen(): void {
  const container = getContainer();

  /* eslint-disable compat/compat, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Polyfills for very old browsers */
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

function fullscreenKeyHandler(e: KeyboardEvent): void {
  if (e.key === "Enter") {
    e.preventDefault();
    toggleFullScreen();
  }
}

export function addKeyboardNavigation(
  options: ILBOptions,
  closeLightbox: () => void,
  previousImage: () => void,
  nextImage: () => void,
): void {
  if (options.fullscreen && fullscreenEnabled) {
    document.addEventListener("keypress", fullscreenKeyHandler);
  }

  if (options.enableKeyboard) {
    keyHandler = (e): void => {
      if (options.quitOnEscKey && e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousImage();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      }
    };
    document.addEventListener("keyup", keyHandler);
  }
}

export function removeKeyboardNavigation(): void {
  document.removeEventListener("keypress", fullscreenKeyHandler);
  if (keyHandler !== null) {
    document.removeEventListener("keyup", keyHandler);
  }
}
