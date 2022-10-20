import { VideoSourceOptions } from "./VideoSourceOptions";

export interface VideoOptions {
    autoplay?: "autoplay";
    controls?: "controls";
    height?: number;
    loop?: "loop";
    muted?: "muted";
    poster?: string;
    preload?: "auto" | "metadata" | "none";
    sources?: Array<VideoSourceOptions>;
    src?: string;
    width?: number;
}
