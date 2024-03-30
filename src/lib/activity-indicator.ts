import "./activity-indicator.css";

import $ from "jquery";

import { getContainer } from "./container";

const activityIndicator = $("<div/>")
  .attr("id", "ilb-activity-indicator")
  .append($("<div/>"));

export function addActivityIndicatorToDOM(): void {
  $(getContainer()).append(activityIndicator);
}

export function removeActivityIndicatorFromDOM(): void {
  activityIndicator.remove();
}
