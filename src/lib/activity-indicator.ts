import "./activity-indicator.css";

import $ from "jquery";

const activityIndicator = $("<div/>")
  .attr("id", "ilb-activity-indicator")
  .append($("<div/>"));

export function addActivityIndicatorToDOM(container: JQuery): void {
  container.append(activityIndicator);
}

export function removeActivityIndicatorFromDOM(): void {
  activityIndicator.remove();
}
