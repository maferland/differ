"use client";

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
      className="flex-1 rounded-xl border border-zinc-700 p-6 text-left transition-colors hover:border-zinc-500 hover:bg-zinc-900"
    >
      <div className="text-sm text-zinc-400">{label}</div>
      {folderName ? (
        <>
          <div className="mt-1 text-lg font-medium truncate">{folderName}</div>
          <div className="mt-1 text-sm text-zinc-500">
            {fileCount} image{fileCount !== 1 ? "s" : ""}
          </div>
        </>
      ) : (
        <div className="mt-1 text-zinc-500">Click to select folder</div>
      )}
    </button>
  );
}
