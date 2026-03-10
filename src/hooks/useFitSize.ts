import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions } from "./useImageDimensions";

interface FitSizeOptions {
  headerOffset?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function useFitSize(
  dims: Dimensions[] | null,
  { headerOffset = 180, containerRef }: FitSizeOptions = {}
) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const recalc = useCallback(() => {
    if (!dims || dims.length === 0) return;

    const maxH = window.innerHeight - headerOffset;
    const maxW = containerRef?.current?.clientWidth ?? window.innerWidth - 64;
    const natW = Math.max(...dims.map((d) => d.w));
    const natH = Math.max(...dims.map((d) => d.h));
    const scale = Math.min(1, maxW / natW, maxH / natH);
    setSize({ width: natW * scale, height: natH * scale });
  }, [dims, headerOffset, containerRef]);

  useEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  return size;
}
