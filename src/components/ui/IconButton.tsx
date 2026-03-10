interface IconButtonProps {
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  disabled?: boolean;
  variant?: "default" | "ghost";
  children: React.ReactNode;
}

const VARIANTS = {
  default: "rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900 disabled:opacity-30",
  ghost: "rounded-md p-1 text-zinc-600 transition-all hover:bg-zinc-700 hover:text-red-400",
} as const;

export function IconButton({ onClick, title, disabled, variant = "default", children }: IconButtonProps) {
  return (
    <button onClick={onClick} title={title} disabled={disabled} className={VARIANTS[variant]}>
      {children}
    </button>
  );
}
