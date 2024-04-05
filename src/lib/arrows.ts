import "./arrows.css";
import "./button.css";

import { getContainer } from "./container";

const leftArrow = document.createElement("div");
leftArrow.classList.add("ilb-button", "ilb-arrow");
leftArrow.setAttribute("id", "ilb-arrow-left");
const rightArrow = document.createElement("div");
rightArrow.classList.add("ilb-button", "ilb-arrow");
rightArrow.setAttribute("id", "ilb-arrow-right");

let wrappedLeft: ((e: Event) => void) | null = null;
let wrappedRight: ((e: Event) => void) | null = null;

export function addArrowsToDOM(onleft: () => void, onright: () => void): void {
  wrappedLeft = (e): void => {
    e.stopPropagation();
    onleft();
  };
  wrappedRight = (e): void => {
    e.stopPropagation();
    onright();
  };
  leftArrow.addEventListener("click", wrappedLeft);
  leftArrow.addEventListener("touchend", wrappedLeft);
  rightArrow.addEventListener("click", wrappedRight);
  rightArrow.addEventListener("touchend", wrappedRight);
  getContainer().append(leftArrow, rightArrow);
}

export function removeArrowsFromDOM(): void {
  leftArrow.remove();
  if (wrappedLeft !== null) {
    leftArrow.removeEventListener("click", wrappedLeft);
    leftArrow.removeEventListener("touchend", wrappedLeft);
  }
  if (wrappedRight !== null) {
    rightArrow.removeEventListener("click", wrappedRight);
    rightArrow.removeEventListener("touchend", wrappedRight);
  }
  wrappedLeft = null;
  wrappedRight = null;
}
