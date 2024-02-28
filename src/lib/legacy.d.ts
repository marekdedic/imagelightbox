declare class LegacyDocument extends Document {
    public webkitFullscreenEnabled?: boolean;
    public msFullscreenEnabled?: boolean;

    public webkitFullscreenElement?: Element;
    public msFullscreenElement?: Element;

    public webkitExitFullscreen?: () => Promise<undefined>;
    public msExitFullscreen?: () => Promise<undefined>;
}

declare class LegacyHTMLElement extends HTMLElement {
    public webkitRequestFullScreen?: (
        options: FullscreenOptions,
    ) => Promise<undefined>;
    public msRequestFullscreen?: (
        options: FullscreenOptions,
    ) => Promise<undefined>;
}
