import "./close-button.css";

import $ from "jquery";

const closeButton = $("<div/>", {
  id: "ilb-close-button",
});

export function addCloseButtonToDOM(
  container: JQuery,
  onclick: () => void,
): void {
  container.append(
    closeButton.on("click.ilb7", (): boolean => {
      onclick();
      return false;
    }),
  );
}
