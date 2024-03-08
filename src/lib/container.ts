import $ from "jquery";

const container = $("<div/>", {
  class: "imagelightbox-container",
});

export function addContainerToDOM(): void {
  $("body").append(container);
}

export function removeContainerFromDOM(): void {
  container.remove();
}

export function triggerContainerEvent(event: string, element?: JQuery): void {
  container.trigger(event, element);
}

export function temp_getContainer(): JQuery {
  return container;
}
