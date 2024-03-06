import "./caption.css";

import $ from "jquery";

const caption = $("<div/>", {
  id: "ilb-caption",
  html: "&nbsp;",
});

export function addCaptionToDOM(container: JQuery): void {
  container.append(caption);
}

export function setCaption(captionText: string | null): void {
  if (captionText !== null) {
    caption.css("display", "");
    caption.text(captionText);
  } else {
    caption.css("display", "none");
  }
}
