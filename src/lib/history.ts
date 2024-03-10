import $ from "jquery";

import { temp_getContainer } from "./container";
import { addQueryField, getQueryField, removeQueryField } from "./query";
import type { State } from "./State";
import { TransitionDirection } from "./TransitionDirection";

export function pushQuitToHistory(): void {
  let newQuery = removeQueryField(
    document.location.search,
    "imageLightboxIndex",
  );
  newQuery = removeQueryField(newQuery, "imageLightboxSet");
  window.history.pushState({}, "", document.location.pathname + newQuery);
}

export function pushToHistory(images: JQuery, index: number): void {
  const newIndex = images[index].dataset.ilb2Id ?? index.toString();
  const newState = {
    imageLightboxIndex: newIndex,
    imageLightboxSet: "",
  };
  const set = images[index].dataset.imagelightbox;
  let newQuery = addQueryField(
    document.location.search,
    "imageLightboxIndex",
    newIndex,
  );
  if (set !== undefined) {
    newState.imageLightboxSet = set;
    newQuery = addQueryField(newQuery, "imageLightboxSet", set);
  }
  window.history.pushState(newState, "", document.location.pathname + newQuery);
}

export function openHistory(
  images: JQuery,
  state: State,
  setTargetIndex: (index: number) => void,
  openLightbox: (element: JQuery, noHistory: boolean) => void,
): void {
  const id = getQueryField("imageLightboxIndex");
  if (id === undefined) {
    return;
  }
  let element = images.filter('[data-ilb2-id="' + id + '"]');
  let targetIndex = 0;
  if (element.length > 0) {
    state.openLightboxWithImage(element, temp_getContainer());
    targetIndex = images.index(element);
  } else {
    state.openLightbox(parseInt(id), temp_getContainer());
    targetIndex = parseInt(id);
    element = $(images[targetIndex]);
  }
  setTargetIndex(targetIndex);
  const set = getQueryField("imageLightboxSet");
  if (
    element.length === 0 ||
    (set !== undefined && set !== element[0].dataset.imagelightbox)
  ) {
    return;
  }
  openLightbox(element, true);
}

export function popHistory(
  event: BaseJQueryEventObject,
  images: JQuery,
  state: State,
  currentIndex: number,
  openLightbox: (image: JQuery, noHistory: boolean) => void,
  quitLightbox: (noHistory: boolean) => void,
  updateState: (
    newTarget: JQuery,
    newIndex: number,
    transitionDirection: TransitionDirection,
  ) => void,
): void {
  const newState = (event.originalEvent as PopStateEvent).state as
    | { imageLightboxIndex?: string; imageLightboxSet?: string }
    | undefined;
  if (!newState) {
    quitLightbox(true);
    return;
  }
  const newId = newState.imageLightboxIndex;
  if (newId === undefined) {
    quitLightbox(true);
    return;
  }
  if (newState.imageLightboxSet !== state.getSet()) {
    return;
  }
  let element = images.filter('[data-ilb2-id="' + newId + '"]');
  if (element.length === 0) {
    const rawElement = images.get(parseInt(newId));
    if (rawElement === undefined) {
      return;
    }
    element = $(rawElement);
  }
  if (currentIndex < 0) {
    openLightbox(element, true);
    return;
  }
  const newIndex = images.index(element);
  let direction = TransitionDirection.Left;
  if (newIndex > currentIndex) {
    direction = TransitionDirection.Right;
  }
  state.changeImage(newIndex, temp_getContainer());
  updateState(element, newIndex, direction);
}
