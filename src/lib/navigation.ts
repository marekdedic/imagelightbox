import "./navigation.css";

import $ from "jquery";

import { TransitionDirection } from "./TransitionDirection";

const navigationItemTemplate = $("<a/>", {
  href: "#",
});
const navigation = $("<div/>", {
  class: "ilb-navigation",
});

export function addNavigationToDOM(
  container: JQuery,
  images: () => JQuery,
  currentIndex: () => number,
  navigate: (target: JQuery, direction: TransitionDirection) => void,
): void {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- images cannot be iterated in old jQuery and the result wouldn't be used anyway
  for (let i = 0; i < images().length; i++) {
    navigation.append(navigationItemTemplate.clone());
  }
  const navigationItems = navigation.children("a");
  navigationItems.eq(currentIndex()).addClass("ilb-navigation-active");

  container.on("previous.ilb2 next.ilb2", (): void => {
    navigationItems
      .removeClass("ilb-navigation-active")
      .eq(currentIndex())
      .addClass("ilb-navigation-active");
  });
  container.append(navigation);

  navigation
    .on("click.ilb7 touchend.ilb7", (): boolean => false)
    .on("click.ilb7 touchend.ilb7", "a", function (): void {
      /* TODO: Re-enable
      if (inProgress) {
        return;
      }
      */
      const $this = $(this);
      if (
        images().eq($this.index()).attr("href") === $("#ilb-image").attr("src")
      ) {
        return;
      }
      const newTarget = images().eq($this.index());
      const loadDirection =
        $this.index() < currentIndex()
          ? TransitionDirection.Left
          : TransitionDirection.Right;
      navigate(newTarget, loadDirection);
      $this
        .addClass("ilb-navigation-active")
        .siblings()
        .removeClass("ilb-navigation-active");
    });
}
