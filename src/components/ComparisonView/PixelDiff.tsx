import { useEffect, useRef, useState } from "react";
import { ImagePair } from "@/lib/types";
import { DiffResult } from "@/lib/pixelmatchRunner";
import { Spinner } from "@/components/ui/icons";

interface PixelDiffProps {
  pair: ImagePair;
  cachedDiff: DiffResult | null;
  onEnsureDiff: (pairId: string) => Promise<DiffResult | null>;
}

export function PixelDiff({ pair, cachedDiff, onEnsureDiff }: PixelDiffProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cssSize, setCssSize] = useState<{ width: number; height: number } | null>(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiffResult | null>(cachedDiff);

  // Trigger diff computation when no cached result
  useEffect(() => {
    if (cachedDiff) {
      setResult(cachedDiff);
      return;
    }
    let cancelled = false;
    setComputing(true);
    setError(null);

    onEnsureDiff(pair.id)
      .then((res) => {
        if (!cancelled) setResult(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setComputing(false);
      });

    return () => { cancelled = true; };
  }, [pair.id, cachedDiff, onEnsureDiff]);

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
      {computing && (
        <div className="flex items-center gap-2 text-zinc-400">
          <Spinner />
          Computing diff...
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded-lg border border-zinc-800"
        style={{
          display: computing ? "none" : "block",
          width: cssSize?.width,
          height: cssSize?.height,
        }}
      />
      {result && !computing && (
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
