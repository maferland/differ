import { useState, useEffect, useRef } from "react";
import { ProjectMeta } from "@/lib/projectStore";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onSwitch: (name: string) => void;
  onDelete: (name: string) => void;
  onNew: () => void;
  projects: ProjectMeta[];
  currentName: string;
}

export function ProjectModal({
  open,
  onClose,
  onSave,
  onSwitch,
  onDelete,
  onNew,
  projects,
  currentName,
}: ProjectModalProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(currentName !== "default" ? currentName : "");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, currentName]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  const otherProjects = projects.filter((p) => p.name !== currentName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Projects</h2>
          <button
            onClick={onClose}
            className="text-zinc-600 transition-colors hover:text-zinc-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current project */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-600">
            Current project
          </div>
          <form onSubmit={handleSave} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none transition-colors focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-30"
            >
              Save
            </button>
          </form>
        </div>

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-600">
              Switch to
            </div>
            <div className="flex max-h-48 flex-col gap-1 overflow-auto">
              {otherProjects.map((p) => (
                <div
                  key={p.name}
                  className="group flex items-center justify-between rounded-lg px-3 py-2 text-zinc-300 transition-colors hover:bg-zinc-800/70"
                >
                  <button
                    onClick={() => {
                      onSwitch(p.name);
                      onClose();
                    }}
                    className="flex-1 text-left text-sm"
                  >
                    {p.name}
                  </button>
                  <button
                    onClick={() => onDelete(p.name)}
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

        {/* New project */}
        <button
          onClick={() => {
            onNew();
            onClose();
          }}
          className="w-full rounded-lg border border-dashed border-zinc-800 py-2 text-xs text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-400"
        >
          + New project
        </button>
      </div>
    </div>
  );
}
