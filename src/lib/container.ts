import "./container.css";

const container = document.createElement("dialog");
container.setAttribute("id", "ilb-container");
document.body.appendChild(container);
/*
 * A modal dialog is dismissed by the browser on escape, which would close the
 * lightbox behind its back and leave it thinking it is still open. Closing is
 * driven by the lightbox itself instead - on escape by the keyboard navigation,
 * if it is enabled.
 */
container.addEventListener("cancel", (e) => {
  e.preventDefault();
});

let wrappedOnclick: ((e: Event) => void) | null = null;

export function addContainerToDOM(
  animationSpeed: number,
  attachOnclick: boolean,
  onclick: () => void,
): void {
  container.classList.remove("ilb-overlay");
  document.body.classList.add("ilb-body");
  container.showModal();
  if (attachOnclick) {
    wrappedOnclick = (e): void => {
      e.stopPropagation();
      onclick();
    };
    container.addEventListener("click", wrappedOnclick);
    container.addEventListener("touchend", wrappedOnclick);
  }
  container.style.transition = `opacity ${animationSpeed.toString()}ms ease`;
  setTimeout(() => {
    container.style.opacity = "1";
  }, 50);
}

export function darkenOverlay(): void {
  container.classList.add("ilb-overlay");
}

export function getContainer(): HTMLDialogElement {
  return container;
}

export function removeContainerFromDOM(): void {
  if (wrappedOnclick !== null) {
    container.removeEventListener("click", wrappedOnclick);
    container.removeEventListener("touchend", wrappedOnclick);
  }
  container.close();
  container.textContent = "";
  document.body.classList.remove("ilb-body");
}

export function transitionOutContainer(): void {
  container.style.opacity = "0";
}
