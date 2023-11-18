export type ProgressItem = {
  src: string;
  type?: string;
  currentTime: number;
  duration: number;
  playbackRate?: number;
  thumbnail?: string | null;
  name?: string;
};
