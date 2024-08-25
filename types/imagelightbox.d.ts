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
