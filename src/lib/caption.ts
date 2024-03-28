import "./caption.css";

import $ from "jquery";

import { getContainer } from "./container";

const caption = $("<div/>", {
  id: "ilb-caption",
  html: "&nbsp;",
}).on("click.ilb7", () => false);

export function setCaption(
  captionText: string | null,
  animationSpeed: number,
): void {
  if (captionText !== null) {
    getContainer().append(caption);
    caption.css(
      "transition",
      "opacity " + animationSpeed.toString() + "ms ease",
    );
    caption.show(() => {
      caption.css("opacity", "1");
    });
    caption.text(captionText);
  } else {
    caption.css("opacity", "0");
    setTimeout(() => {
      caption.remove();
    }, animationSpeed);
  }
}
