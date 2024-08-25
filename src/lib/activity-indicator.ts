import "./activity-indicator.css";
import { getContainer } from "./container";

const activityIndicator = document.createElement("div");
activityIndicator.setAttribute("id", "ilb-activity-indicator");
activityIndicator.appendChild(document.createElement("div"));

export function addActivityIndicatorToDOM(): void {
  getContainer().appendChild(activityIndicator);
}

export function removeActivityIndicatorFromDOM(): void {
  activityIndicator.remove();
}
