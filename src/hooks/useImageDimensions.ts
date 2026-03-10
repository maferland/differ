import { useEffect, useRef, useState } from "react";

export interface Dimensions {
  w: number;
  h: number;
}

export function useImageDimensions(urls: string[]): Dimensions[] | null {
  const [dims, setDims] = useState<Dimensions[] | null>(null);
  const prevUrls = useRef(urls);

  useEffect(() => {
    if (urls.length === 0) return;
    let cancelled = false;

    Promise.all(
      urls.map(
        (url) =>
          new Promise<Dimensions>((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.src = url;
          })
      )
    ).then((results) => {
      if (!cancelled) setDims(results);
    });

    return () => { cancelled = true; };
  }, [urls.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when URLs change
  if (prevUrls.current !== urls && urls.join(",") !== prevUrls.current.join(",")) {
    prevUrls.current = urls;
  }

  return dims;
}
