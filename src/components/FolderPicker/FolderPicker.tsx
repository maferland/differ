
import { ProjectMeta } from "@/lib/projectStore";
import { FolderPickerButton } from "./FolderPickerButton";

interface FolderSide {
  folderName: string | null;
  files: { length: number };
  pickFolder: () => void;
}

interface FolderPickerProps {
  left: FolderSide;
  right: FolderSide;
  canCompare: boolean;
  projects: ProjectMeta[];
  onCompare: () => void;
  onRestoreProject: (name: string) => void;
  onDeleteProject: (name: string) => void;
}

export function FolderPicker({
  left,
  right,
  canCompare,
  projects,
  onCompare,
  onRestoreProject,
  onDeleteProject,
}: FolderPickerProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Differ</h1>
        <p className="text-sm text-zinc-500">Select two folders to compare images</p>
      </div>

      <div className="flex w-full max-w-xl gap-3">
        <FolderPickerButton
          label="Left"
          folderName={left.folderName}
          fileCount={left.files.length}
          onPick={left.pickFolder}
        />
        <div className="flex items-center text-zinc-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <FolderPickerButton
          label="Right"
          folderName={right.folderName}
          fileCount={right.files.length}
          onPick={right.pickFolder}
        />
      </div>

      <button
        onClick={onCompare}
        disabled={!canCompare}
        className="rounded-lg bg-purple-600 px-10 py-2.5 text-sm font-medium transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Compare
      </button>

      {projects.length > 0 && (
        <div className="w-full max-w-xl">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
            Recent projects
          </div>
          <div className="flex flex-col gap-1">
            {projects.map((p) => (
              <div
                key={p.name}
                className="group flex items-center justify-between rounded-lg border border-zinc-800/50 px-4 py-2.5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                <button
                  onClick={() => onRestoreProject(p.name)}
                  className="flex-1 text-left text-sm text-zinc-300"
                >
                  {p.name}
                </button>
                <button
                  onClick={() => onDeleteProject(p.name)}
                  className="text-zinc-700 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                  title="Delete project"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
