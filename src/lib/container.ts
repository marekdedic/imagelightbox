import "./container.css";

const container = document.createElement("div");
container.setAttribute("id", "ilb-container");

let wrappedOnclick: ((e: Event) => void) | null = null;

export function addContainerToDOM(
  animationSpeed: number,
  attachOnclick: boolean,
  onclick: () => void,
): void {
  container.classList.remove("ilb-overlay");
  document.body.classList.add("ilb-body");
  document.body.appendChild(container);
  if (attachOnclick) {
    wrappedOnclick = (e): void => {
      e.stopPropagation();
      onclick();
    };
    container.addEventListener("click", wrappedOnclick);
    container.addEventListener("touchend", wrappedOnclick);
  }
  container.style.transition =
    "opacity " + animationSpeed.toString() + "ms ease";
  // TODO: Check
  setTimeout(() => {
    container.style.opacity = "1";
  }, 1);
}

export function darkenOverlay(): void {
  container.classList.add("ilb-overlay");
}

export function transitionOutContainer(): void {
  container.style.opacity = "0";
}

export function removeContainerFromDOM(): void {
  if (wrappedOnclick !== null) {
    container.removeEventListener("click", wrappedOnclick);
    container.removeEventListener("touchend", wrappedOnclick);
  }
  container.remove();
  container.textContent = "";
  document.body.classList.remove("ilb-body");
}

export function getContainer(): HTMLDivElement {
  return container;
}
