import "./overlay.css";

import $ from "jquery";

const overlay = $("<div/>", {
  id: "ilb-overlay",
});

export function addOverlayToDOM(container: JQuery): void {
  container.append(overlay);
}
