import { fullscreenEnabled, toggleFullscreen } from "./fullscreen";

let keyHandler: ((e: KeyboardEvent) => void) | null = null;

function fullscreenKeyHandler(e: KeyboardEvent): void {
  if (e.key === "Enter") {
    e.preventDefault();
    toggleFullscreen();
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
