import { openHistory } from "./history";
import { State } from "./State";

export class ImageLightbox {
  private readonly s: State;

  public constructor(
    images:
      | Array<HTMLAnchorElement>
      | HTMLCollectionOf<HTMLAnchorElement>
      | NodeListOf<HTMLAnchorElement>,
    options?: Partial<ILBOptions>,
  ) {
    const opts: ILBOptions = {
      activity: false,
      allowedTypes: "png|jpg|jpeg|gif",
      animationSpeed: 250,
      arrows: false,
      button: false,
      caption: false,
      enableKeyboard: true,
      fullscreen: false,
      gutter: 10,
      history: false,
      navigation: false,
      overlay: false,
      preloadNext: true,
      quitOnDocClick: true,
      quitOnEnd: false,
      quitOnEscKey: true,
      quitOnImgClick: false,
      ...options,
    };
    this.s = State(
      opts,
      images.length > 0 ? (images[0].dataset["imagelightbox"] ?? "") : "",
      Array.from(images),
    );

    if (opts.history) {
      this.openHistory();
    }
  }

  public addImages(
    images:
      | Array<HTMLAnchorElement>
      | HTMLCollectionOf<HTMLAnchorElement>
      | NodeListOf<HTMLAnchorElement>,
  ): void {
    this.s.addImages(Array.from(images));
  }

  public close(): void {
    this.s.close();
  }

  public next(): void {
    this.s.next();
  }

  public open(image?: HTMLAnchorElement): void {
    if (image !== undefined) {
      this.s.openWithImage(image);
    } else {
      this.s.open(0);
    }
  }

  public openHistory(): void {
    openHistory(
      this.s.set(),
      this.s.images(),
      (index: number, skipHistory?: boolean) => {
        this.s.open(index, skipHistory);
      },
    );
  }

  public previous(): void {
    this.s.previous();
  }
}
