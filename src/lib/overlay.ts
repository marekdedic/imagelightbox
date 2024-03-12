import "./overlay.css";

import $ from "jquery";

const overlay = $("<div/>", {
  id: "ilb-overlay",
});

export function addOverlayToDOM(
  container: JQuery,
  attachOnclick: boolean,
  onclick: () => void,
): void {
  overlay.removeClass("ilb-overlay-dark");
  container.append(overlay);
  if (attachOnclick) {
    overlay.on(
      "ontouchstart" in window ? "touchend.ilb7" : "click.ilb7",
      (e): void => {
        e.preventDefault();
        onclick();
      },
    );
  }
}

export function darkenOverlay(): void {
  overlay.addClass("ilb-overlay-dark");
}
