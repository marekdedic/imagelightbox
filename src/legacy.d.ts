declare class LegacyCSSStyleDeclaration extends CSSStyleDeclaration {
    public MozTransition: string;
    public OTransition: string;
}

declare class LegacyDocument extends Document {
    public webkitFullscreenEnabled?: boolean;
    public mozFullScreenEnabled?: boolean;
    public msFullscreenEnabled?: boolean;

    public mozFullScreenElement?: Element;
    public webkitFullscreenElement?: Element;
    public msFullscreenElement?: Element;

    public mozCancelFullScreen?: () => Promise<undefined>;
    public webkitExitFullscreen?: () => Promise<undefined>;
    public msExitFullscreen?: () => Promise<undefined>;
}

declare class LegacyHTMLElement extends HTMLElement {
    public mozRequestFullScreen?: (
        options: FullscreenOptions,
    ) => Promise<undefined>;
    public webkitRequestFullScreen?: (
        options: FullscreenOptions,
    ) => Promise<undefined>;
    public msRequestFullscreen?: (
        options: FullscreenOptions,
    ) => Promise<undefined>;
}

declare class LegacyNavigator extends Navigator {
    public pointerEnabled: boolean;
    public msPointerEnabled: boolean;
}

declare class LegacyPointerEvent extends PointerEvent {
    public MSPOINTER_TYPE_MOUSE: string;
}
