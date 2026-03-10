
import { useState, useEffect } from "react";
import { DiffResult, runPixelDiff } from "@/lib/pixelmatchRunner";

export function usePixelDiff(leftSrc: string, rightSrc: string) {
  const [result, setResult] = useState<DiffResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leftSrc || !rightSrc) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setResult(null);

    runPixelDiff(leftSrc, rightSrc)
      .then((res) => {
        if (!cancelled) setResult(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [leftSrc, rightSrc]);

  return { result, loading, error };
}
