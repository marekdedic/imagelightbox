import "./button.css";
import "./close-button.css";

import { getContainer } from "./container";

const closeButton = document.createElement("button");
closeButton.classList.add("ilb-button");
closeButton.setAttribute("id", "ilb-close-button");

let wrappedClose: ((e: Event) => void) | null = null;

export function addCloseButtonToDOM(onclick: () => void): void {
  wrappedClose = (e): void => {
    e.stopPropagation();
    onclick();
  };
  closeButton.addEventListener("click", wrappedClose);
  getContainer().appendChild(closeButton);
}

export function removeCloseButtonFromDOM(): void {
  if (wrappedClose !== null) {
    closeButton.removeEventListener("click", wrappedClose);
  }
  closeButton.remove();
}
