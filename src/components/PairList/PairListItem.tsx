import { ImagePair } from "@/lib/types";
import { PairArrow, Unpair } from "@/components/ui/icons";

interface PairListItemProps {
  pair: ImagePair;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function PairListItem({ pair, onOpen, onRemove }: PairListItemProps) {
  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-3 transition-all hover:border-zinc-600 hover:bg-zinc-800/50"
      onClick={() => onOpen(pair.id)}
    >
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
        <img src={pair.left.objectUrl} alt={pair.left.name} className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{pair.left.name}</div>
        {pair.left.name !== pair.right.name && (
          <div className="truncate text-xs text-zinc-500">{pair.right.name}</div>
        )}
      </div>
      <PairArrow className="flex-shrink-0 text-zinc-600" />
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
        <img src={pair.right.objectUrl} alt={pair.right.name} className="h-full w-full object-contain" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(pair.id);
        }}
        className="flex-shrink-0 rounded-md p-1 text-zinc-600 opacity-0 transition-all hover:bg-zinc-700 hover:text-red-400 group-hover:opacity-100"
        title="Unpair"
      >
        <Unpair />
      </button>
    </div>
  );
}
