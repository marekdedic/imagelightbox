import { addQueryField, getQueryField, removeQueryField } from "./query";
import { TransitionDirection } from "./TransitionDirection";

export function pushQuitToHistory(): void {
  let newQuery = removeQueryField(
    document.location.search,
    "imageLightboxIndex",
  );
  newQuery = removeQueryField(newQuery, "imageLightboxSet");
  window.history.pushState({}, "", document.location.pathname + newQuery);
}

export function pushToHistory(
  index: number,
  set: string | undefined,
  images: JQuery,
): void {
  const newIndex = images[index].dataset.ilb2Id ?? index.toString();
  const newHistoryState = {
    imageLightboxIndex: newIndex,
    imageLightboxSet: "",
  };
  let newQuery = addQueryField(
    document.location.search,
    "imageLightboxIndex",
    newIndex,
  );
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

export function openHistory(
  set: string | undefined,
  images: JQuery,
  open: (index: number, skipHistory?: boolean) => void,
): void {
  const id = getQueryField("imageLightboxIndex");
  if (id === undefined) {
    return;
  }
  let newIndex = images.index('[data-ilb2-id="' + id + '"]');
  if (newIndex < 0) {
    newIndex = parseInt(id);
  }
  if (getQueryField("imageLightboxSet") !== set) {
    return;
  }
  open(newIndex, true);
}

export function popHistory(
  event: BaseJQueryEventObject,
  set: string | undefined,
  images: JQuery,
  currentIndex: number | null,
  open: (index: number, skipHistory?: boolean) => void,
  close: (skipHistory?: boolean) => void,
  change: (
    index: number,
    transitionDirection: TransitionDirection,
    skipHistory?: boolean,
  ) => void,
): void {
  const newHistoryState = (event.originalEvent as PopStateEvent).state as
    | { imageLightboxIndex?: string; imageLightboxSet?: string }
    | undefined;
  if (!newHistoryState) {
    close(true);
    return;
  }
  if (newHistoryState.imageLightboxSet !== set) {
    return;
  }
  const newId = newHistoryState.imageLightboxIndex;
  if (newId === undefined) {
    close(true);
    return;
  }
  let newIndex = images
    .get()
    .findIndex((e: HTMLElement) => e.dataset.ilb2Id === newId);
  if (newIndex < 0) {
    newIndex = parseInt(newId);
  }
  if (currentIndex === null) {
    open(newIndex, true);
    return;
  }
  const direction =
    newIndex > currentIndex
      ? TransitionDirection.Right
      : TransitionDirection.Left;
  change(newIndex, direction, true);
}
