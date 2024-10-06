let keyHandler: ((e: KeyboardEvent) => void) | null = null;

export function addKeyboardNavigation(
  options: ILBOptions,
  closeLightbox: () => void,
  previousImage: () => void,
  nextImage: () => void,
): void {
  if (!options.enableKeyboard) {
    return;
  }
  keyHandler = (e): void => {
    if (e.key === "Escape") {
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

export function removeKeyboardNavigation(): void {
  if (keyHandler !== null) {
    document.removeEventListener("keyup", keyHandler);
  }
}
