import { addQueryField, getQueryField, removeQueryField } from "./query";
import { TransitionDirection } from "./TransitionDirection";

interface HistoryState {
  imageLightboxIndex?: string;
  imageLightboxSet?: string;
}

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
  images: Array<HTMLAnchorElement>,
): void {
  const newIndex = images[index].dataset.ilb2Id ?? index.toString();
  let newQuery = addQueryField(
    document.location.search,
    "imageLightboxIndex",
    newIndex,
  );
  const newHistoryState: HistoryState = {
    imageLightboxIndex: newIndex,
    imageLightboxSet: "",
  };
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
  images: Array<HTMLAnchorElement>,
  open: (index: number, skipHistory?: boolean) => void,
): void {
  if (getQueryField("imageLightboxSet") !== set) {
    return;
  }
  const id = getQueryField("imageLightboxIndex");
  if (id === undefined) {
    return;
  }
  let newIndex = images.findIndex((image) => image.dataset.ilb2Id === id);
  if (newIndex < 0) {
    newIndex = parseInt(id, 10);
  }
  open(newIndex, true);
}

export function popHistory(
  event: PopStateEvent,
  set: string | undefined,
  images: Array<HTMLAnchorElement>,
  currentIndex: number | null,
  open: (index: number, skipHistory?: boolean) => void,
  close: (skipHistory?: boolean) => void,
  change: (
    index: number,
    transitionDirection: TransitionDirection,
    skipHistory?: boolean,
  ) => void,
): void {
  const historyState = event.state as
    | HistoryState
    | Record<string, never>
    | null
    | undefined;
  // This needs to be before checking the set in order to close the lightbox when navigating to a non-imagelightbox state
  if (!historyState || Object.keys(historyState).length === 0) {
    close(true);
    return;
  }
  if (historyState.imageLightboxSet !== set) {
    return;
  }
  const newId = historyState.imageLightboxIndex;
  if (newId === undefined) {
    close(true);
    return;
  }
  let newIndex = images.findIndex(
    (e: HTMLElement) => e.dataset.ilb2Id === newId,
  );
  if (newIndex < 0) {
    newIndex = parseInt(newId, 10);
  }
  if (currentIndex === null) {
    open(newIndex, true);
    return;
  }
  change(
    newIndex,
    newIndex > currentIndex
      ? TransitionDirection.Right
      : TransitionDirection.Left,
    true,
  );
}
