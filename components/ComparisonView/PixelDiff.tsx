"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePair } from "@/lib/types";
import { DiffResult } from "@/lib/pixelmatchRunner";
import { usePixelDiff } from "@/hooks/usePixelDiff";

interface PixelDiffProps {
  pair: ImagePair;
  cachedDiff: DiffResult | null;
}

export function PixelDiff({ pair, cachedDiff }: PixelDiffProps) {
  const live = usePixelDiff(
    cachedDiff ? "" : pair.left.objectUrl,
    cachedDiff ? "" : pair.right.objectUrl
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cssSize, setCssSize] = useState<{ width: number; height: number } | null>(null);

  const result = cachedDiff ?? live.result;
  const loading = !cachedDiff && live.loading;
  const error = !cachedDiff ? live.error : null;

  useEffect(() => {
    if (!result || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    canvasRef.current.width = result.canvas.width;
    canvasRef.current.height = result.canvas.height;
    ctx.drawImage(result.canvas, 0, 0);

    // Scale canvas CSS size to fit viewport
    const maxH = window.innerHeight - 180;
    const maxW = wrapperRef.current?.clientWidth ?? window.innerWidth - 64;
    const scale = Math.min(1, maxW / result.canvas.width, maxH / result.canvas.height);
    setCssSize({
      width: result.canvas.width * scale,
      height: result.canvas.height * scale,
    });
  }, [result]);

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-4">
      {loading && (
        <div className="text-zinc-400">Computing pixel diff...</div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-zinc-800"
        style={{
          display: loading ? "none" : "block",
          width: cssSize?.width,
          height: cssSize?.height,
        }}
      />
      {result && (
        <div className="text-sm text-zinc-400">
          <span className="font-mono text-white">
            {result.diffPixels.toLocaleString()}
          </span>{" "}
          pixels different —{" "}
          <span className="font-mono text-white">
            {result.percentage.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
}
