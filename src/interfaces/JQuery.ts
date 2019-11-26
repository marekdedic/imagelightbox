interface JQuery
{
    imageLightbox(opts: Partial<ILBOptions>): JQuery;
    addToImageLightbox(elements: JQuery): void;
    openHistory(): void;
    loadPreviousImage(): void;
    loadNextImage(): void;
    quitImageLightbox(): void;
    startImageLightbox(element: JQuery): void;
}
