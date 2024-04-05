import "./navigation.css";

import { getContainer } from "./container";
import { TransitionDirection } from "./TransitionDirection";

const navigation = document.createElement("div");
navigation.classList.add("ilb-navigation");

export function addNavigationItems(
  images: Array<HTMLAnchorElement>,
  currentIndex: () => number | null,
  change: (index: number, transitionDirection: TransitionDirection) => void,
  animationSpeed: number,
): void {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- The result won't be used anyway
  for (let i = 0; i < images.length; i++) {
    const button = document.createElement("button");
    button.style.transition =
      "background-color " + animationSpeed.toString() + "ms ease";
    const buttonClick = (): void => {
      if (button.classList.contains("ilb-navigation-active")) {
        return;
      }
      const buttonIndex = Array.prototype.indexOf.call(
        button.parentNode!.childNodes,
        button,
      );
      const loadDirection =
        buttonIndex < currentIndex()!
          ? TransitionDirection.Left
          : TransitionDirection.Right;
      change(buttonIndex, loadDirection);
    };
    button.addEventListener("click", buttonClick);
    button.addEventListener("touchend", buttonClick);
    navigation.appendChild(button);
  }
}

export function changeNavigationCurrent(currentIndex: number): void {
  for (let i = 0; i < navigation.children.length; i++) {
    navigation.children.item(i)?.classList.remove("ilb-navigation-active");
  }
  navigation.children
    .item(currentIndex)
    ?.classList.add("ilb-navigation-active");
}

export function addNavigationToDOM(
  images: Array<HTMLAnchorElement>,
  currentIndex: () => number | null,
  change: (index: number, transitionDirection: TransitionDirection) => void,
  animationSpeed: number,
): void {
  navigation.textContent = "";
  addNavigationItems(images, currentIndex, change, animationSpeed);
  changeNavigationCurrent(currentIndex()!);
  getContainer().appendChild(navigation);

  navigation.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  navigation.addEventListener("touchend", (e) => {
    e.stopPropagation();
  });
}
