declare global {
  interface Document {
    addEventListener(
      type: "ilb:error",
      listener: (
        this: Document,
        ev: CustomEvent<{ target: HTMLImageElement }>,
      ) => void,
    ): void;
  }
}

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

export class ImageLightbox {
  public constructor(
    images:
      | Array<HTMLAnchorElement>
      | HTMLCollectionOf<HTMLAnchorElement>
      | NodeListOf<HTMLAnchorElement>,
    options?: Partial<ILBOptions>,
  );
  public addImages(
    images:
      | Array<HTMLAnchorElement>
      | HTMLCollectionOf<HTMLAnchorElement>
      | NodeListOf<HTMLAnchorElement>,
  ): void;
  public close(): void;
  public next(): void;
  public open(image?: HTMLAnchorElement): void;
  public openHistory(): void;
  public previous(): void;
}
