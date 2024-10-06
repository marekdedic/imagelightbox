declare class LegacyDocument extends Document {
  public webkitExitFullscreen?: () => Promise<void>;
  public webkitFullscreenElement?: Element | null;
  public webkitFullscreenEnabled?: boolean;
}

declare class LegacyHTMLElement extends HTMLElement {
  public webkitRequestFullScreen?: () => Promise<undefined>;
}
