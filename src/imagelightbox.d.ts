declare class LegacyCSSStyleDeclaration extends CSSStyleDeclaration
{
    public MozTransition?: any;
    public OTransition?: any;
}
declare class LegacyDocument extends Document
{
    public webkitFullscreenEnabled?: any;
    public mozFullScreenEnabled?: any;
    public msFullscreenEnabled?: any;

    public mozCancelFullScreen?: any;
    public webkitExitFullscreen?: any;
    public msExitFullscreen?: any;

    public mozFullScreenElement?: any;
    public webkitFullscreenElement?: any;
    public msFullscreenElement?: any;
}
declare class LegacyHTMLElement extends HTMLElement
{
    public mozRequestFullScreen?: any;
    public webkitRequestFullScreen?: any;
    public msRequestFullscreen?: any;
}
declare class LegacyPointerEvent extends PointerEvent
{
    public MSPOINTER_TYPE_MOUSE?: string;
}
