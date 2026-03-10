import { ImageFile, ImagePair, UnmatchedFile } from "./types";

export function matchFiles(
  leftFiles: ImageFile[],
  rightFiles: ImageFile[]
): { pairs: ImagePair[]; unmatched: UnmatchedFile[] } {
  const rightMap = new Map<string, ImageFile>();
  for (const f of rightFiles) {
    rightMap.set(f.normalizedName, f);
  }

  const pairs: ImagePair[] = [];
  const unmatched: UnmatchedFile[] = [];
  const matchedRight = new Set<string>();

  for (const left of leftFiles) {
    const right = rightMap.get(left.normalizedName);
    if (right) {
      pairs.push({
        id: `${left.name}__${right.name}`,
        left,
        right,
      });
      matchedRight.add(left.normalizedName);
    } else {
      unmatched.push({ side: "left", file: left });
    }
  }

  for (const right of rightFiles) {
    if (!matchedRight.has(right.normalizedName)) {
      unmatched.push({ side: "right", file: right });
    }
  }

  return { pairs, unmatched };
}
