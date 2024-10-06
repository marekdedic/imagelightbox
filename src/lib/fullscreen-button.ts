import "./button.css";
import { getContainer } from "./container";
import { toggleFullscreen } from "./fullscreen";
import "./fullscreen-button.css";

const fullscreenButton = document.createElement("button");
fullscreenButton.classList.add("ilb-button");
fullscreenButton.setAttribute("id", "ilb-fullscreen-button");
fullscreenButton.innerHTML = "&#x26F6;";
fullscreenButton.addEventListener("click", (e): void => {
  e.stopPropagation();
  toggleFullscreen();
});

export function addFullscreenButtonToDOM(): void {
  getContainer().appendChild(fullscreenButton);
}

export function removeFullscreenButtonFromDOM(): void {
  fullscreenButton.remove();
}
