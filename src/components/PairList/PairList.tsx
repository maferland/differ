
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ImagePair, UnmatchedFile } from "@/lib/types";
import { PairListItem } from "./PairListItem";
import { UnmatchedSection } from "./UnmatchedSection";

interface PairListProps {
  pairs: ImagePair[];
  unmatched: UnmatchedFile[];
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onManualPair: (leftName: string, rightName: string) => void;
}

export function PairList({
  pairs,
  unmatched,
  onOpen,
  onRemove,
  onManualPair,
}: PairListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: pairs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 px-8 pt-4 pb-2">
      <h2 className="text-xl font-bold">
        Matched Pairs ({pairs.length})
      </h2>
      <div ref={parentRef} className="min-h-0 flex-1 overflow-auto pr-2">
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((vItem) => {
            const pair = pairs[vItem.index];
            return (
              <div
                key={pair.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vItem.start}px)`,
                }}
              >
                <PairListItem pair={pair} onOpen={onOpen} onRemove={onRemove} />
              </div>
            );
          })}
        </div>
      </div>
      <UnmatchedSection unmatched={unmatched} onManualPair={onManualPair} />
    </div>
  );
}
