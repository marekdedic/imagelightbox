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

export function pushToHistory(index: number, state: State): void {
  const newIndex = state.getImages()[index].dataset.ilb2Id ?? index.toString();
  const newHistoryState = {
    imageLightboxIndex: newIndex,
    imageLightboxSet: "",
  };
  let newQuery = addQueryField(
    document.location.search,
    "imageLightboxIndex",
    newIndex,
  );
  const set = state.getSet();
  if (set !== undefined) {
    newHistoryState.imageLightboxSet = set;
    newQuery = addQueryField(newQuery, "imageLightboxSet", set);
  }
  window.history.pushState(
    newHistoryState,
    "",
    document.location.pathname + newQuery,
  );
}

export function openHistory(state: State): void {
  const id = getQueryField("imageLightboxIndex");
  if (id === undefined) {
    return;
  }
  let newIndex = state.getImages().index('[data-ilb2-id="' + id + '"]');
  if (newIndex < 0) {
    newIndex = parseInt(id);
  }
  if (getQueryField("imageLightboxSet") !== state.getSet()) {
    return;
  }
  state.openLightbox(newIndex, true);
}

export function popHistory(event: BaseJQueryEventObject, state: State): void {
  const newHistoryState = (event.originalEvent as PopStateEvent).state as
    | { imageLightboxIndex?: string; imageLightboxSet?: string }
    | undefined;
  if (!newHistoryState) {
    state.closeLightbox(true);
    return;
  }
  const newId = newHistoryState.imageLightboxIndex;
  if (newId === undefined) {
    state.closeLightbox(true);
    return;
  }
  if (newHistoryState.imageLightboxSet !== state.getSet()) {
    return;
  }
  let newIndex = state.getImages().index('[data-ilb2-id="' + newId + '"]');
  if (newIndex < 0) {
    newIndex = parseInt(newId);
  }
  const currentIndex = state.getCurrentIndex();
  if (currentIndex === null) {
    state.openLightbox(newIndex, true);
    return;
  }
  const direction =
    newIndex > currentIndex
      ? TransitionDirection.Right
      : TransitionDirection.Left;
  state.changeImage(newIndex, direction, true);
}
