declare class LegacyDocument extends Document {
  public webkitExitFullscreen?: () => Promise<undefined>;
  public webkitFullscreenElement?: Element;
  public webkitFullscreenEnabled?: boolean;
}

declare class LegacyHTMLElement extends HTMLElement {
  public webkitRequestFullScreen?: () => Promise<undefined>;
}
