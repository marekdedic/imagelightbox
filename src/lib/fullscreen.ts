import { getContainer } from "./container";

export const fullscreenEnabled: boolean =
  // eslint-disable-next-line compat/compat -- The prefixed version fixes the incompatibility
  document.fullscreenEnabled ||
  ((document as LegacyDocument).webkitFullscreenEnabled ?? false);

function fullscreenElement(): Element | null {
  return (
    // eslint-disable-next-line compat/compat -- The prefixed version fixes the incompatibility
    document.fullscreenElement ??
    (document as LegacyDocument).webkitFullscreenElement ??
    null
  );
}

/* eslint-disable compat/compat, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Polyfills for very old browsers */
const requestFullscreen = (element: HTMLElement): void => {
  void (
    element.requestFullscreen ||
    (element as LegacyHTMLElement).webkitRequestFullScreen
  ).call(element);
};

const exitFullscreen = (): void => {
  void (
    document.exitFullscreen || (document as LegacyDocument).webkitExitFullscreen
  ).call(document);
};
/* eslint-enable */

export function toggleFullscreen(): void {
  if (fullscreenElement() === null) {
    requestFullscreen(getContainer());
  } else {
    exitFullscreen();
  }
}
