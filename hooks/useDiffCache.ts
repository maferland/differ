"use client";

import { useRef, useEffect, useCallback } from "react";
import { ImagePair } from "@/lib/types";
import { DiffResult, runPixelDiff } from "@/lib/pixelmatchRunner";

export function useDiffCache(pairs: ImagePair[]) {
  const cache = useRef<Map<string, DiffResult>>(new Map());
  const pending = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const pair of pairs) {
      if (cache.current.has(pair.id) || pending.current.has(pair.id)) continue;
      pending.current.add(pair.id);
      runPixelDiff(pair.left.objectUrl, pair.right.objectUrl)
        .then((result) => {
          cache.current.set(pair.id, result);
        })
        .finally(() => {
          pending.current.delete(pair.id);
        });
    }
  }, [pairs]);

  const getDiff = useCallback((pairId: string) => {
    return cache.current.get(pairId) ?? null;
  }, []);

  const invalidate = useCallback(() => {
    cache.current.clear();
    pending.current.clear();
  }, []);

  return { getDiff, invalidate };
}
