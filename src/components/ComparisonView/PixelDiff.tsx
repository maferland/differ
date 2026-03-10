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
  const [showSpinner, setShowSpinner] = useState(true);

  const result = cachedDiff ?? live.result;
  const computing = !cachedDiff && live.loading;
  const error = !cachedDiff ? live.error : null;

  // Show spinner for at least 250ms to avoid flash
  useEffect(() => {
    setShowSpinner(true);
    const timer = setTimeout(() => setShowSpinner(false), 250);
    return () => clearTimeout(timer);
  }, [pair.left.objectUrl, pair.right.objectUrl]);

  const loading = computing || showSpinner;

  useEffect(() => {
    if (!result || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    canvasRef.current.width = result.canvas.width;
    canvasRef.current.height = result.canvas.height;
    ctx.drawImage(result.canvas, 0, 0);

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
    <div ref={wrapperRef} className="flex flex-1 flex-col items-center justify-center gap-4">
      {loading && (
        <div className="flex items-center gap-2 text-zinc-400">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Computing diff...
        </div>
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
      {result && !loading && (
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
