declare class LegacyDocument extends Document {
  public webkitFullscreenEnabled?: boolean;

  public webkitFullscreenElement?: Element;

  public webkitExitFullscreen?: () => Promise<undefined>;
}

declare class LegacyHTMLElement extends HTMLElement {
  public webkitRequestFullScreen?: () => Promise<undefined>;
}
