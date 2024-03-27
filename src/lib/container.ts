import "./container.css";

import $ from "jquery";

const container = $("<div/>", {
  id: "ilb-container",
});

export function addContainerToDOM(): void {
  $("body").append(container);
  $("body").addClass("ilb-body");
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
