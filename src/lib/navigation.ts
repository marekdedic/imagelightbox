import "./navigation.css";

import $ from "jquery";

import { getContainer } from "./container";
import { TransitionDirection } from "./TransitionDirection";

const navigation = $("<div/>", {
  class: "ilb-navigation",
});

export function addNavigationItems(
  images: JQuery,
  animationSpeed: number,
): void {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- images cannot be iterated in old jQuery and the result wouldn't be used anyway
  for (let i = 0; i < images.length; i++) {
    navigation.append($("<button/>"));
  }
  navigation
    .children()
    .css(
      "transition",
      "background-color " + animationSpeed.toString() + "ms ease",
    );
}

export function changeNavigationCurrent(currentIndex: number): void {
  navigation
    .children()
    .removeClass("ilb-navigation-active")
    .eq(currentIndex)
    .addClass("ilb-navigation-active");
}

export function addNavigationToDOM(
  images: () => JQuery,
  currentIndex: () => number | null,
  change: (index: number, transitionDirection: TransitionDirection) => void,
  animationSpeed: number,
): void {
  navigation.empty();
  addNavigationItems(images(), animationSpeed);
  changeNavigationCurrent(currentIndex()!);
  getContainer().append(navigation);

  navigation
    .on("click.ilb7 touchend.ilb7", (): boolean => false)
    .children()
    .on("click.ilb7 touchend.ilb7", function (): boolean {
      const $this = $(this);
      if (
        images().eq($this.index()).attr("href") === $("#ilb-image").attr("src")
      ) {
        return false;
      }
      const loadDirection =
        $this.index() < currentIndex()!
          ? TransitionDirection.Left
          : TransitionDirection.Right;
      change($this.index(), loadDirection);
      return false;
    });
}
