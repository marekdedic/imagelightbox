import "./close-button.css";

import $ from "jquery";

import { getContainer } from "./container";

const closeButton = $("<div/>", {
  id: "ilb-close-button",
});

export function addCloseButtonToDOM(onclick: () => void): void {
  getContainer().append(
    closeButton.on("click.ilb7", (): boolean => {
      onclick();
      return false;
    }),
  );
}
