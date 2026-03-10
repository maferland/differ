export interface ImageFile {
  name: string;
  normalizedName: string;
  path: string;
  objectUrl: string;
}

export interface ImagePair {
  id: string;
  left: ImageFile;
  right: ImageFile;
}

export interface UnmatchedFile {
  side: "left" | "right";
  file: ImageFile;
}

export type AppPhase = "idle" | "pairing" | "comparing";

export type ComparisonMode = "side-by-side" | "pixel-diff" | "slider";
