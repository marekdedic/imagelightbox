interface ILBOptions {
  activity: boolean;
  allowedTypes: string;
  animationSpeed: number;
  arrows: boolean;
  button: boolean;
  caption: boolean;
  enableKeyboard: boolean;
  fullscreen: boolean;
  gutter: number;
  history: boolean;
  navigation: boolean;
  overlay: boolean;
  preloadNext: boolean;
  quitOnDocClick: boolean;
  quitOnEnd: boolean;
  quitOnImgClick: boolean;
}

interface JQuery {
  addToImageLightbox(elements: JQuery<HTMLAnchorElement>): void;
  imageLightbox(opts?: Partial<ILBOptions>): JQuery;
  loadNextImage(): void;
  loadPreviousImage(): void;
  openHistory(): void;
  quitImageLightbox(): void;
  startImageLightbox(element?: JQuery<HTMLAnchorElement>): void;
}
