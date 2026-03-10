import { useRef, useCallback, useEffect } from "react";
import { ImagePair } from "@/lib/types";
import { DiffResult, runPixelDiff } from "@/lib/pixelmatchRunner";

export function useDiffCache(pairs: ImagePair[]) {
  const cache = useRef<Map<string, DiffResult>>(new Map());
  const pending = useRef<Map<string, Promise<DiffResult | null>>>(new Map());

  // Clear cache when pairs change (e.g. refresh)
  useEffect(() => {
    cache.current.clear();
    pending.current.clear();
  }, [pairs]);

  const getDiff = useCallback(
    (pairId: string): DiffResult | null => {
      return cache.current.get(pairId) ?? null;
    },
    []
  );

  const ensureDiff = useCallback(
    async (pairId: string): Promise<DiffResult | null> => {
      const cached = cache.current.get(pairId);
      if (cached) return cached;

      const inflight = pending.current.get(pairId);
      if (inflight) return inflight;

      const pair = pairs.find((p) => p.id === pairId);
      if (!pair) return null;

      const promise = runPixelDiff(pair.left.objectUrl, pair.right.objectUrl)
        .then((result) => {
          cache.current.set(pairId, result);
          pending.current.delete(pairId);
          return result;
        })
        .catch(() => {
          pending.current.delete(pairId);
          return null;
        });

      pending.current.set(pairId, promise);
      return promise;
    },
    [pairs]
  );

  return { getDiff, ensureDiff };
}
