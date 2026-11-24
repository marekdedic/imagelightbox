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
  // The legacy API doesn't return a promise
  Promise.resolve(
    (
      element.requestFullscreen ||
      (element as LegacyHTMLElement).webkitRequestFullScreen
    ).call(element),
  ).catch((): void => {
    // The browser refused, there is nothing to do about it
  });
};

const exitFullscreen = (): void => {
  Promise.resolve(
    (
      document.exitFullscreen ||
      (document as LegacyDocument).webkitExitFullscreen
    ).call(document),
  ).catch((): void => {
    // The browser refused, there is nothing to do about it
  });
};
/* eslint-enable */

export function leaveFullscreen(): void {
  if (fullscreenElement() !== null) {
    exitFullscreen();
  }
}

export function toggleFullscreen(): void {
  if (fullscreenElement() === null) {
    /*
     * The container is a modal <dialog>, which browsers refuse to make fullscreen ("Dialog elements are invalid").
     * The whole page is made fullscreen instead - the modal dialog stays in the top layer, so it's still shown over it.
     */
    requestFullscreen(document.documentElement);
  } else {
    exitFullscreen();
  }
}
