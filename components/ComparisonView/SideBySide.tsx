"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePair } from "@/lib/types";

interface SideBySideProps {
  pair: ImagePair;
}

export function SideBySide({ pair }: SideBySideProps) {
  const [zoom, setZoom] = useState(1);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const [imgHeight, setImgHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute a shared image height so both images render at the same visual size.
  // We pick the height that fits both images within the container without overflow.
  useEffect(() => {
    const leftImg = new Image();
    const rightImg = new Image();
    let cancelled = false;

    const containerH = containerRef.current?.clientHeight ?? 600;
    const containerW = containerRef.current
      ? (containerRef.current.clientWidth - 16) / 2 // gap-4 = 16px, 2 columns
      : 400;

    Promise.all([
      new Promise<{ w: number; h: number }>((res) => {
        leftImg.onload = () => res({ w: leftImg.naturalWidth, h: leftImg.naturalHeight });
        leftImg.src = pair.left.objectUrl;
      }),
      new Promise<{ w: number; h: number }>((res) => {
        rightImg.onload = () => res({ w: rightImg.naturalWidth, h: rightImg.naturalHeight });
        rightImg.src = pair.right.objectUrl;
      }),
    ]).then(([l, r]) => {
      if (cancelled) return;
      // For each image, find the max height that fits in containerW x containerH
      const leftFitH = Math.min(containerH, (containerW / l.w) * l.h);
      const rightFitH = Math.min(containerH, (containerW / r.w) * r.h);
      // Use the smaller so both fit
      setImgHeight(Math.min(leftFitH, rightFitH));
    });

    return () => { cancelled = true; };
  }, [pair.left.objectUrl, pair.right.objectUrl]);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-zinc-400">Zoom</label>
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-sm text-zinc-500">{zoom}x</span>
      </div>
      <div
        ref={containerRef}
        className="flex gap-4"
        style={{ height: "calc(100vh - 160px)" }}
      >
        {[
          { ref: leftRef, img: pair.left, otherRef: rightRef },
          { ref: rightRef, img: pair.right, otherRef: leftRef },
        ].map(({ ref, img, otherRef }, i) => (
          <div
            key={i}
            ref={ref}
            className="flex-1 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 flex items-start justify-center"
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
                height: imgHeight ? `${imgHeight * zoom}px` : undefined,
                width: "auto",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-center text-sm text-zinc-500">
        <div className="flex-1">{pair.left.name}</div>
        <div className="flex-1">{pair.right.name}</div>
      </div>
    </div>
  );
}
