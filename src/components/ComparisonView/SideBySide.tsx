import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ImagePair } from "@/lib/types";
import { useImageDimensions } from "@/hooks/useImageDimensions";

export type Layout = "side-by-side" | "top-bottom";

interface SideBySideProps {
  pair: ImagePair;
  leftFolder: string | null;
  rightFolder: string | null;
  layout: Layout;
}

export function SideBySide({ pair, leftFolder, rightFolder, layout }: SideBySideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const [fitHeight, setFitHeight] = useState<number | null>(null);
  const [zoom, setZoom] = useState(0.75);

  const pairId = `${pair.left.name}__${pair.right.name}`;
  const prevPairId = useRef(pairId);
  useEffect(() => {
    if (prevPairId.current !== pairId) {
      setZoom(0.75);
      setFitHeight(null);
      prevPairId.current = pairId;
    }
  }, [pairId]);
  useEffect(() => {
    setZoom(0.75);
  }, [layout]);

  const urls = useMemo(() => [pair.left.objectUrl, pair.right.objectUrl], [pair.left.objectUrl, pair.right.objectUrl]);
  const dims = useImageDimensions(urls);

  const recalcFit = useCallback(() => {
    if (!dims || dims.length < 2) return;
    const [l, r] = dims;
    const headerOffset = 120;
    const availH = window.innerHeight - headerOffset;
    const containerW = containerRef.current?.clientWidth ?? window.innerWidth - 64;
    const colW = layout === "side-by-side" ? (containerW - 16) / 2 : containerW;
    const maxH = layout === "side-by-side" ? availH : (availH - 16) / 2;
    const leftFitH = Math.min(maxH, (colW / l.w) * l.h);
    const rightFitH = Math.min(maxH, (colW / r.w) * r.h);
    setFitHeight(Math.min(leftFitH, rightFitH));
  }, [dims, layout]);

  useEffect(() => {
    recalcFit();
  }, [recalcFit]);

  useEffect(() => {
    window.addEventListener("resize", recalcFit);
    return () => window.removeEventListener("resize", recalcFit);
  }, [recalcFit]);

  const syncScroll = useCallback(
    (source: HTMLDivElement, target: HTMLDivElement) => {
      if (syncing.current) return;
      syncing.current = true;
      target.scrollTop = source.scrollTop;
      target.scrollLeft = source.scrollLeft;
      syncing.current = false;
    },
    []
  );

  const imgH = fitHeight ? fitHeight * zoom : undefined;
  const isHorizontal = layout === "side-by-side";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isHorizontal && (
        <div className="flex gap-4 pb-2 text-center text-xs text-zinc-500">
          <div className="flex-1">{leftFolder}</div>
          <div className="flex-1">{rightFolder}</div>
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex min-h-0 flex-1 gap-4 ${isHorizontal ? "" : "flex-col"}`}
      >
        {[
          { img: pair.left, ref: leftRef, otherRef: rightRef, folder: leftFolder },
          { img: pair.right, ref: rightRef, otherRef: leftRef, folder: rightFolder },
        ].map(({ img, ref, otherRef, folder }, i) => (
          <div key={i} className="flex min-h-0 flex-1 flex-col">
            {!isHorizontal && (
              <div className="pb-1 text-xs text-zinc-500">{folder}</div>
            )}
            <div
              ref={ref}
              className={`overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 ${
                zoom <= 1 ? "flex items-center justify-center" : ""
              } min-h-0 flex-1`}
              onScroll={() => {
                if (ref.current && otherRef.current) {
                  syncScroll(ref.current, otherRef.current);
                }
              }}
            >
              <img
                src={img.objectUrl}
                alt={img.name}
                style={{
                  height: imgH ? `${imgH}px` : undefined,
                  width: "auto",
                }}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 pt-3">
        <button
          onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
          disabled={zoom <= 0.25}
          className="rounded border border-zinc-700 px-2 py-0.5 text-sm transition-colors hover:bg-zinc-900 disabled:opacity-30"
        >
          -
        </button>
        <button
          onClick={() => setZoom(1)}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
          disabled={zoom >= 4}
          className="rounded border border-zinc-700 px-2 py-0.5 text-sm transition-colors hover:bg-zinc-900 disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
