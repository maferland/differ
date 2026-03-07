"use client";

import { useState } from "react";
import { ProjectMeta } from "@/lib/handleStore";
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
  const [showProjects, setShowProjects] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Image Diff</h1>
      <p className="text-zinc-400">Select two folders to compare images</p>

      <div className="flex w-full max-w-2xl gap-4">
        <FolderPickerButton
          label="Left Folder"
          folderName={left.folderName}
          fileCount={left.files.length}
          onPick={left.pickFolder}
        />
        <FolderPickerButton
          label="Right Folder"
          folderName={right.folderName}
          fileCount={right.files.length}
          onPick={right.pickFolder}
        />
      </div>

      <div className="flex gap-3">
        {projects.length > 0 && (
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-900"
          >
            Open Project
          </button>
        )}
        <button
          onClick={onCompare}
          disabled={!canCompare}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare
        </button>
      </div>

      {showProjects && (
        <div className="flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-zinc-800 p-4">
          <div className="text-xs text-zinc-500">Saved projects</div>
          <div className="flex flex-col gap-1">
            {projects.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
              >
                <button
                  onClick={() => {
                    onRestoreProject(p.name);
                    setShowProjects(false);
                  }}
                  className="flex-1 text-left text-sm"
                >
                  {p.name}
                </button>
                <button
                  onClick={() => onDeleteProject(p.name)}
                  className="ml-2 text-xs text-zinc-600 hover:text-red-400"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
