import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ImagePair, UnmatchedFile } from "@/lib/types";
import { PairListItem } from "./PairListItem";
import { UnmatchedSection } from "./UnmatchedSection";
import { SideBadge } from "@/components/ui/SideBadge";

type ListItem =
  | { type: "pair"; pair: ImagePair }
  | { type: "unmatched"; item: UnmatchedFile };

interface PairListProps {
  pairs: ImagePair[];
  unmatched: UnmatchedFile[];
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onManualPair: (leftName: string, rightName: string) => void;
  onOpenUnmatched: (file: UnmatchedFile) => void;
}

const ROW_HEIGHT = 56;
const GAP = 6;

export function PairList({
  pairs,
  unmatched,
  onOpen,
  onRemove,
  onManualPair,
  onOpenUnmatched,
}: PairListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [showUnmatched, setShowUnmatched] = useState(false);

  const items: ListItem[] = [
    ...pairs.map((pair): ListItem => ({ type: "pair", pair })),
    ...(showUnmatched
      ? unmatched.map((item): ListItem => ({ type: "unmatched", item }))
      : []),
  ];

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 5,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 px-8 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">
          Matched Pairs ({pairs.length})
        </h2>
        {unmatched.length > 0 && (
          <button
            onClick={() => setShowUnmatched(!showUnmatched)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              showUnmatched
                ? "bg-purple-600/20 text-purple-300"
                : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {showUnmatched ? "Hide" : "Show"} unmatched ({unmatched.length})
          </button>
        )}
      </div>
      <div ref={parentRef} className="min-h-0 flex-1 overflow-auto pr-2">
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((vItem) => {
            const item = items[vItem.index];
            return (
              <div
                key={item.type === "pair" ? item.pair.id : `unmatched-${item.item.side}-${item.item.file.name}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: ROW_HEIGHT,
                  transform: `translateY(${vItem.start}px)`,
                }}
              >
                {item.type === "pair" ? (
                  <PairListItem pair={item.pair} onOpen={onOpen} onRemove={onRemove} />
                ) : (
                  <div
                    className="group flex h-full cursor-pointer items-center gap-4 rounded-xl border border-dashed border-zinc-700/50 bg-zinc-900/20 px-4 transition-all hover:border-zinc-600 hover:bg-zinc-800/40"
                    onClick={() => onOpenUnmatched(item.item)}
                  >
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      <img src={item.item.file.objectUrl} alt={item.item.file.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-zinc-400">{item.item.file.name}</div>
                    </div>
                    <SideBadge side={item.item.side} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {!showUnmatched && (
        <UnmatchedSection unmatched={unmatched} onManualPair={onManualPair} />
      )}
    </div>
  );
}
