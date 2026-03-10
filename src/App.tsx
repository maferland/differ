import { useCallback, useEffect, useState } from "react";
import { FolderPicker } from "@/components/FolderPicker";
import { PairList } from "@/components/PairList";
import { ComparisonView } from "@/components/ComparisonView";
import { ProjectModal } from "@/components/SaveProjectModal";
import { useImagePairs } from "@/hooks/useImagePairs";

export function App() {
  const {
    left,
    right,
    pairs,
    unmatched,
    activePair,
    activePairIndex,
    phase,
    canCompare,
    projectName,
    projects,
    compare,
    refresh,
    refreshing,
    restoreProject,
    saveAsProject,
    removeProject,
    newProject,
    setProjectName,
    mode,
    setMode,
    manualPair,
    removePair,
    openPair,
    closePair,
    getDiff,
  } = useImagePairs();

  const [showProjectModal, setShowProjectModal] = useState(false);

  const handleSaveProject = useCallback(
    (name: string) => {
      setProjectName(name);
      saveAsProject(name);
    },
    [setProjectName, saveAsProject]
  );

  const navigate = useCallback(
    (direction: -1 | 1) => {
      if (!activePair) return;
      const idx = pairs.findIndex((p) => p.id === activePair.id);
      const next = idx + direction;
      if (next >= 0 && next < pairs.length) {
        openPair(pairs[next].id);
      }
    },
    [activePair, pairs, openPair]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "comparing") return;
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "Escape") closePair();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, navigate, closePair]);

  const projectModal = (
    <ProjectModal
      open={showProjectModal}
      onClose={() => setShowProjectModal(false)}
      onSave={handleSaveProject}
      onSwitch={restoreProject}
      onDelete={removeProject}
      onNew={newProject}
      projects={projects}
      currentName={projectName}
    />
  );

  if (phase === "comparing" && activePair) {
    return (
      <>
        <ComparisonView
          pair={activePair}
          pairIndex={activePairIndex}
          totalPairs={pairs.length}
          mode={mode}
          projectName={projectName}
          leftFolder={left.folderName}
          rightFolder={right.folderName}
          onModeChange={setMode}
          onClose={closePair}
          onNavigate={navigate}
          onRefresh={refresh}
          refreshing={refreshing}
          cachedDiff={getDiff(activePair.id)}
        />
        {projectModal}
      </>
    );
  }

  if (phase === "pairing") {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center gap-3 p-4 pb-0">
          <button
            onClick={newProject}
            className="rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900"
            title="Back to folder picker"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          {projectName !== "default" && (
            <span className="text-sm text-zinc-500">{projectName}</span>
          )}
          <span className="text-sm text-zinc-600">
            {left.folderName} → {right.folderName}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="rounded-lg border border-zinc-700 p-2 transition-colors hover:bg-zinc-900 disabled:opacity-50"
              title="Refresh images"
            >
              <svg
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0115-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 01-15 6.7L3 16" />
              </svg>
            </button>
            <button
              onClick={() => setShowProjectModal(true)}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-900"
            >
              Projects
            </button>
          </div>
        </div>
        <PairList
          pairs={pairs}
          unmatched={unmatched}
          onOpen={openPair}
          onRemove={removePair}
          onManualPair={manualPair}
        />
        {projectModal}
      </div>
    );
  }

  return (
    <>
      <FolderPicker
        left={left}
        right={right}
        canCompare={canCompare}
        projects={projects}
        onCompare={compare}
        onRestoreProject={restoreProject}
        onDeleteProject={removeProject}
      />
      {projectModal}
    </>
  );
}
