interface ILBOptions {
  allowedTypes: string;
  animationSpeed: number;
  activity: boolean;
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
  addToImageLightbox(elements: JQuery): void;
  openHistory(): void;
  loadPreviousImage(): void;
  loadNextImage(): void;
  quitImageLightbox(): void;
  startImageLightbox(element?: JQuery): void;
}
