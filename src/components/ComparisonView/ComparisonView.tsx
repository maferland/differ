import { useState } from "react";
import { ImagePair, ComparisonMode } from "@/lib/types";
import { DiffResult } from "@/lib/pixelmatchRunner";
import { SideBySide, Layout } from "./SideBySide";
import { PixelDiff } from "./PixelDiff";
import { SliderView } from "./SliderView";
import { ViewHeader } from "@/components/ui/ViewHeader";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeft, ChevronRight, Refresh } from "@/components/ui/icons";

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
  onEnsureDiff: (pairId: string) => Promise<DiffResult | null>;
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
  onEnsureDiff,
}: ComparisonViewProps) {
  const [layout, setLayout] = useState<Layout>("side-by-side");

  return (
    <div className="flex h-screen flex-col gap-2 p-4">
      {/* Row 1: Navigation — back, project, pair nav */}
      <ViewHeader projectName={projectName} onBack={onClose} backTitle="Back to list (Esc)">
        <div className="ml-auto flex items-center gap-1">
          <IconButton onClick={() => onNavigate(-1)} disabled={pairIndex <= 0} title="Previous pair">
            <ChevronLeft size={14} />
          </IconButton>
          <span className="min-w-[4rem] text-center text-sm tabular-nums text-zinc-500">
            {pairIndex + 1} / {totalPairs}
          </span>
          <IconButton onClick={() => onNavigate(1)} disabled={pairIndex >= totalPairs - 1} title="Next pair">
            <ChevronRight size={14} />
          </IconButton>
        </div>
      </ViewHeader>

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
        <IconButton onClick={onRefresh} disabled={refreshing} title="Refresh images">
          <Refresh className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </IconButton>
        <span className="ml-auto text-sm text-zinc-400">{pair.left.name}</span>
      </div>

      {mode === "side-by-side" && (
        <SideBySide pair={pair} leftFolder={leftFolder} rightFolder={rightFolder} layout={layout} />
      )}
      {mode === "pixel-diff" && (
        <PixelDiff pair={pair} cachedDiff={cachedDiff} onEnsureDiff={onEnsureDiff} />
      )}
      {mode === "slider" && <SliderView pair={pair} />}
    </div>
  );
}
