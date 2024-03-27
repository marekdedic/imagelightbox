import "./overlay.css";

import $ from "jquery";

import { getContainer } from "./container";

// TODO: Remove overlay and move functionality to container
const overlay = $("<div/>", {
  id: "ilb-overlay",
});

export function addOverlayToDOM(
  attachOnclick: boolean,
  onclick: () => void,
): void {
  overlay.removeClass("ilb-overlay-dark");
  getContainer().append(overlay);
  if (attachOnclick) {
    overlay.on(
      "ontouchstart" in window ? "touchend.ilb7" : "click.ilb7",
      (): boolean => {
        onclick();
        return false;
      },
    );
  }
}

export function darkenOverlay(): void {
  overlay.addClass("ilb-overlay-dark");
}
