import "./navigation.css";

import $ from "jquery";

import type { State } from "./State";
import { TransitionDirection } from "./TransitionDirection";

const navigationItemTemplate = $("<a/>", {
  href: "#",
});
const navigation = $("<div/>", {
  class: "ilb-navigation",
});

export function addNavigationToDOM(state: State, container: JQuery): void {
  navigation.empty();
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- images cannot be iterated in old jQuery and the result wouldn't be used anyway
  for (let i = 0; i < state.getImages().length; i++) {
    navigation.append(navigationItemTemplate.clone());
  }
  const navigationItems = navigation.children("a");
  navigationItems
    .eq(state.getCurrentIndex()!)
    .addClass("ilb-navigation-active");

  container.on("previous.ilb2 next.ilb2", (_, image: JQuery): void => {
    navigationItems
      .removeClass("ilb-navigation-active")
      .eq(state.getImages().index(image))
      .addClass("ilb-navigation-active");
  });
  container.append(navigation);

  navigation
    .on("click.ilb7 touchend.ilb7", (): boolean => false)
    .on("click.ilb7 touchend.ilb7", "a", function (): void {
      const $this = $(this);
      if (
        state.getImages().eq($this.index()).attr("href") ===
        $("#ilb-image").attr("src")
      ) {
        return;
      }
      const loadDirection =
        $this.index() < state.getCurrentIndex()!
          ? TransitionDirection.Left
          : TransitionDirection.Right;
      state.changeImage($this.index(), loadDirection);
      $this
        .addClass("ilb-navigation-active")
        .siblings()
        .removeClass("ilb-navigation-active");
    });
}
