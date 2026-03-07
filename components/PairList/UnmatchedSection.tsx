"use client";

import { useState } from "react";
import { UnmatchedFile } from "@/lib/types";

interface UnmatchedSectionProps {
  unmatched: UnmatchedFile[];
  onManualPair: (leftName: string, rightName: string) => void;
}

export function UnmatchedSection({ unmatched, onManualPair }: UnmatchedSectionProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const leftFiles = unmatched.filter((u) => u.side === "left");
  const rightFiles = unmatched.filter((u) => u.side === "right");

  if (leftFiles.length === 0 && rightFiles.length === 0) return null;

  const handleRightClick = (rightName: string) => {
    if (selectedLeft) {
      onManualPair(selectedLeft, rightName);
      setSelectedLeft(null);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">
        Unmatched ({leftFiles.length + rightFiles.length})
        {selectedLeft && (
          <span className="ml-2 text-blue-400">
            Select a right image to pair with
          </span>
        )}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs text-zinc-500">Left</div>
          {leftFiles.map((u) => (
            <button
              key={u.file.name}
              onClick={() =>
                setSelectedLeft(
                  selectedLeft === u.file.name ? null : u.file.name
                )
              }
              className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                selectedLeft === u.file.name
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <img
                src={u.file.objectUrl}
                alt={u.file.name}
                className="h-10 w-10 rounded object-cover"
              />
              <span className="truncate text-sm">{u.file.name}</span>
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-xs text-zinc-500">Right</div>
          {rightFiles.map((u) => (
            <button
              key={u.file.name}
              onClick={() => handleRightClick(u.file.name)}
              disabled={!selectedLeft}
              className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-colors ${
                selectedLeft
                  ? "border-zinc-800 hover:border-blue-500 hover:bg-blue-500/10"
                  : "border-zinc-800 opacity-50"
              }`}
            >
              <img
                src={u.file.objectUrl}
                alt={u.file.name}
                className="h-10 w-10 rounded object-cover"
              />
              <span className="truncate text-sm">{u.file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
