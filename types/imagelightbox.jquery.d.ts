interface ILBOptions {
  activity: boolean;
  allowedTypes: string;
  animationSpeed: number;
  arrows: boolean;
  button: boolean;
  caption: boolean;
  enableKeyboard: boolean;
  history: boolean;
  fullscreen: boolean;
  gutter: number;
  navigation: boolean;
  overlay: boolean;
  preloadNext: boolean;
  quitOnEnd: boolean;
  quitOnImgClick: boolean;
  quitOnDocClick: boolean;
  quitOnEscKey: boolean;
}

interface JQuery {
  imageLightbox(opts?: Partial<ILBOptions>): JQuery;
  addToImageLightbox(elements: JQuery<HTMLAnchorElement>): void;
  openHistory(): void;
  loadPreviousImage(): void;
  loadNextImage(): void;
  quitImageLightbox(): void;
  startImageLightbox(element?: JQuery<HTMLAnchorElement>): void;
}
