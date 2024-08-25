import "./caption.css";
import { getContainer } from "./container";

const caption = document.createElement("caption");
caption.setAttribute("id", "ilb-caption");
caption.textContent = "&nbsp;";
caption.addEventListener("click", (e) => {
  e.stopPropagation();
});

export function setCaption(captionText: string, animationSpeed: number): void {
  if (captionText !== "") {
    getContainer().appendChild(caption);
    caption.style.transition = `opacity ${animationSpeed.toString()}ms ease`;
    setTimeout(() => {
      caption.style.opacity = "1";
    }, 1);
    caption.textContent = captionText;
  } else {
    caption.style.opacity = "0";
    setTimeout(() => {
      caption.remove();
    }, animationSpeed);
  }
}
