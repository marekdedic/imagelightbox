import "./navigation.css";

import $ from "jquery";

import { getContainer } from "./container";
import { TransitionDirection } from "./TransitionDirection";

const navigationItemTemplate = $("<a/>", {
  href: "#",
});
const navigation = $("<div/>", {
  class: "ilb-navigation",
});

export function addNavigationItems(images: JQuery): void {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- images cannot be iterated in old jQuery and the result wouldn't be used anyway
  for (let i = 0; i < images.length; i++) {
    navigation.append(navigationItemTemplate.clone());
  }
}

// TODO: Refactor
export function addNavigationToDOM(
  images: () => JQuery,
  currentIndex: () => number | null,
  change: (index: number, transitionDirection: TransitionDirection) => void,
): void {
  navigation.empty();
  addNavigationItems(images());
  navigation
    .children("a")
    .eq(currentIndex()!)
    .addClass("ilb-navigation-active");

  getContainer().on("previous.ilb2 next.ilb2", (_, image: JQuery): void => {
    $(".ilb-navigation a")
      .removeClass("ilb-navigation-active")
      .eq(images().index(image))
      .addClass("ilb-navigation-active");
  });
  getContainer().append(navigation);

  navigation
    .on("click.ilb7 touchend.ilb7", (): boolean => false)
    .on("click.ilb7 touchend.ilb7", "a", function (): boolean {
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
      $this
        .addClass("ilb-navigation-active")
        .siblings()
        .removeClass("ilb-navigation-active");
      return false;
    });
}
