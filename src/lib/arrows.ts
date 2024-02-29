import "./arrows.css";

import $ from "jquery";

const leftArrow = $("<div/>", {
  class: "ilb-arrow",
  id: "ilb-arrow-left",
});
const rightArrow = $("<div/>", {
  class: "ilb-arrow",
  id: "ilb-arrow-right",
});

export function addArrowsToDOM(
  container: JQuery,
  onleft: () => void,
  onright: () => void,
): void {
  container.append(
    leftArrow.on("click.ilb7 touchend.ilb7", (e): void => {
      e.stopImmediatePropagation();
      e.preventDefault();
      onleft();
    }),
    rightArrow.on("click.ilb7 touchend.ilb7", (e): void => {
      e.stopImmediatePropagation();
      e.preventDefault();
      onright();
    }),
  );
}

export function showArrows(): void {
  $(".ilb-arrow").css("display", "block");
}
