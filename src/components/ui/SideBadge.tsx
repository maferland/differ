const STYLES = {
  left: "bg-blue-500/15 text-blue-400",
  right: "bg-amber-500/15 text-amber-400",
} as const;

export function SideBadge({ side }: { side: "left" | "right" }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STYLES[side]}`}>
      {side} only
    </span>
  );
}
