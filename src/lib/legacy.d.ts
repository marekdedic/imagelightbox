interface LegacyDocument extends Document {
  webkitExitFullscreen?(): Promise<void>;
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
}

interface LegacyHTMLElement extends HTMLElement {
  webkitRequestFullScreen?(): Promise<undefined>;
}
