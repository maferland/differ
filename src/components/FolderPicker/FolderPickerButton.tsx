
interface FolderPickerButtonProps {
  label: string;
  folderName: string | null;
  fileCount: number;
  onPick: () => void;
}

export function FolderPickerButton({
  label,
  folderName,
  fileCount,
  onPick,
}: FolderPickerButtonProps) {
  return (
    <button
      onClick={onPick}
      className="group flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left transition-all hover:border-purple-500/40 hover:bg-zinc-900"
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 transition-colors group-hover:text-purple-400">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
        {label}
      </div>
      {folderName ? (
        <>
          <div className="mt-2 truncate text-base font-medium">{folderName}</div>
          <div className="mt-1 text-xs text-zinc-500">
            {fileCount} image{fileCount !== 1 ? "s" : ""}
          </div>
        </>
      ) : (
        <div className="mt-2 text-sm text-zinc-600">Click to select folder</div>
      )}
    </button>
  );
}
