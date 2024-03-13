import "./container.css";

import $ from "jquery";

const container = $("<div/>", {
  id: "ilb-container",
});

export function addContainerToDOM(
  animationSpeed: number,
  attachOnclick: boolean,
  onclick: () => void,
): void {
  container.removeClass("ilb-overlay");
  $("body").addClass("ilb-body");
  $("body").append(container);
  if (attachOnclick) {
    container.on("click.ilb7 touchend.ilb7", (): boolean => {
      onclick();
      return false;
    });
  }
  container.animate({ opacity: 1 }, animationSpeed);
}

export function darkenOverlay(): void {
  container.addClass("ilb-overlay");
}

export function fadeOutContainer(animationSpeed: number): void {
  container.animate({ opacity: 0 }, animationSpeed);
}

export function removeContainerFromDOM(): void {
  container.remove();
  container.empty();
  $("body").removeClass("ilb-body");
}

export function triggerContainerEvent(event: string, element?: JQuery): void {
  container.trigger(event, element);
}

export function getContainer(): JQuery {
  return container;
}
