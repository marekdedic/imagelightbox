interface ExportedFunctions extends JQuery
{
    imageLightbox(opts: ILBOptions): ExportedFunctions;
    addToImageLightbox(elements: JQuery): void;
    openHistory(): void;
    loadPreviousImage(): void;
    loadNextImage(): void;
    quitImageLightbox(): void;
    startImageLightbox(element: JQuery): void;
}
