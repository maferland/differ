import { useRef, useCallback } from "react";
import { ImagePair } from "@/lib/types";
import { DiffResult, runPixelDiff } from "@/lib/pixelmatchRunner";

export function useDiffCache(pairs: ImagePair[]) {
  const cache = useRef<Map<string, DiffResult>>(new Map());
  const pending = useRef<Map<string, Promise<DiffResult>>>(new Map());
  const prevPairsRef = useRef<ImagePair[]>([]);

  // Clear cache when pairs change (e.g. refresh)
  if (prevPairsRef.current !== pairs) {
    cache.current.clear();
    pending.current.clear();
    prevPairsRef.current = pairs;
  }

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
          return null as unknown as DiffResult;
        });

      pending.current.set(pairId, promise);
      return promise;
    },
    [pairs]
  );

  return { getDiff, ensureDiff };
}
