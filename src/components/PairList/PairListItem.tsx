
import { ImagePair } from "@/lib/types";

interface PairListItemProps {
  pair: ImagePair;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PairListItem({ pair, onOpen, onRemove }: PairListItemProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-lg border border-zinc-800 p-3 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
      onClick={() => onOpen(pair.id)}
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-900">
        <img
          src={pair.left.objectUrl}
          alt={pair.left.name}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm">{pair.left.name}</div>
        {pair.left.name !== pair.right.name && (
          <div className="truncate text-xs text-zinc-500">{pair.right.name}</div>
        )}
      </div>
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-900">
        <img
          src={pair.right.objectUrl}
          alt={pair.right.name}
          className="h-full w-full object-contain"
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(pair.id);
        }}
        className="flex-shrink-0 text-zinc-500 hover:text-red-400"
        title="Unpair"
      >
        x
      </button>
    </div>
  );
}
