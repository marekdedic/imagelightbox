import "./arrows.css";
import "./button.css";

import $ from "jquery";

import { getContainer } from "./container";

const leftArrow = $("<div/>", {
  class: "ilb-button ilb-arrow",
  id: "ilb-arrow-left",
});
const rightArrow = $("<div/>", {
  class: "ilb-button ilb-arrow",
  id: "ilb-arrow-right",
});

export function addArrowsToDOM(onleft: () => void, onright: () => void): void {
  getContainer().append(
    leftArrow.on("click.ilb7 touchend.ilb7", (): boolean => {
      onleft();
      return false;
    }),
    rightArrow.on("click.ilb7 touchend.ilb7", (): boolean => {
      onright();
      return false;
    }),
  );
}
