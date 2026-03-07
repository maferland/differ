"use client";

import { useState } from "react";
import { ImagePair, ComparisonMode } from "@/lib/types";
import { DiffResult } from "@/lib/pixelmatchRunner";
import { SideBySide } from "./SideBySide";
import { PixelDiff } from "./PixelDiff";
import { SliderView } from "./SliderView";

const TABS: { mode: ComparisonMode; label: string }[] = [
  { mode: "side-by-side", label: "Side by Side" },
  { mode: "pixel-diff", label: "Pixel Diff" },
  { mode: "slider", label: "Slider" },
];

interface ComparisonViewProps {
  pair: ImagePair;
  pairIndex: number;
  totalPairs: number;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
  cachedDiff: DiffResult | null;
}

export function ComparisonView({
  pair,
  pairIndex,
  totalPairs,
  onClose,
  onNavigate,
  cachedDiff,
}: ComparisonViewProps) {
  const [mode, setMode] = useState<ComparisonMode>("side-by-side");

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-900"
        >
          Back
        </button>
        <div className="flex gap-1 rounded-lg border border-zinc-800 p-1">
          {TABS.map(({ mode: m, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                mode === m
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onNavigate(-1)}
            disabled={pairIndex <= 0}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm transition-colors hover:bg-zinc-900 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-400 tabular-nums">
            {pairIndex + 1} / {totalPairs}
          </span>
          <button
            onClick={() => onNavigate(1)}
            disabled={pairIndex >= totalPairs - 1}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm transition-colors hover:bg-zinc-900 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
      {mode === "side-by-side" && <SideBySide pair={pair} />}
      {mode === "pixel-diff" && (
        <PixelDiff pair={pair} cachedDiff={cachedDiff} />
      )}
      {mode === "slider" && <SliderView pair={pair} />}
    </div>
  );
}
