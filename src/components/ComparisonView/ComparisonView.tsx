import { useState } from "react";
import { ImagePair, ComparisonMode } from "@/lib/types";
import { DiffResult } from "@/lib/pixelmatchRunner";
import { SideBySide, Layout } from "./SideBySide";
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
  mode: ComparisonMode;
  projectName: string;
  leftFolder: string | null;
  rightFolder: string | null;
  onModeChange: (mode: ComparisonMode) => void;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
  onRefresh: () => void;
  refreshing: boolean;
  cachedDiff: DiffResult | null;
}

export function ComparisonView({
  pair,
  pairIndex,
  totalPairs,
  mode,
  projectName,
  leftFolder,
  rightFolder,
  onModeChange,
  onClose,
  onNavigate,
  onRefresh,
  refreshing,
  cachedDiff,
}: ComparisonViewProps) {
  const [layout, setLayout] = useState<Layout>("side-by-side");

  return (
    <div className="flex h-screen flex-col gap-2 p-4">
      {/* Row 1: Navigation — back, project, pair nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900"
          title="Back to list (Esc)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        {projectName !== "default" && (
          <span className="text-sm text-zinc-500">{projectName}</span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => onNavigate(-1)}
            disabled={pairIndex <= 0}
            className="rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900 disabled:opacity-30"
            title="Previous pair"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <span className="min-w-[4rem] text-center text-sm tabular-nums text-zinc-500">
            {pairIndex + 1} / {totalPairs}
          </span>
          <button
            onClick={() => onNavigate(1)}
            disabled={pairIndex >= totalPairs - 1}
            className="rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900 disabled:opacity-30"
            title="Next pair"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: View controls — mode tabs, layout, refresh */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-zinc-800 p-1">
          {TABS.map(({ mode: m, label }) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                mode === m
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "side-by-side" && (
          <div className="flex gap-1 rounded-lg border border-zinc-800 p-1">
            {(["side-by-side", "top-bottom"] as Layout[]).map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`rounded-md px-2 py-1 transition-colors ${
                  layout === l
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  {l === "side-by-side" ? (
                    <>
                      <rect x="0" y="1" width="6" height="12" rx="1" />
                      <rect x="8" y="1" width="6" height="12" rx="1" />
                    </>
                  ) : (
                    <>
                      <rect x="1" y="0" width="12" height="6" rx="1" />
                      <rect x="1" y="8" width="12" height="6" rx="1" />
                    </>
                  )}
                </svg>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900 disabled:opacity-50"
          title="Refresh images"
        >
          <svg
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0115-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 01-15 6.7L3 16" />
          </svg>
        </button>
        <span className="ml-auto text-sm text-zinc-400">{pair.left.name}</span>
      </div>

      {mode === "side-by-side" && (
        <SideBySide pair={pair} leftFolder={leftFolder} rightFolder={rightFolder} layout={layout} />
      )}
      {mode === "pixel-diff" && (
        <PixelDiff pair={pair} cachedDiff={cachedDiff} />
      )}
      {mode === "slider" && <SliderView pair={pair} />}
    </div>
  );
}
