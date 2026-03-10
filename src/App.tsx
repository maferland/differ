import { useCallback, useEffect, useState } from "react";
import { FolderPicker } from "@/components/FolderPicker";
import { PairList } from "@/components/PairList";
import { ComparisonView, SingleImageView } from "@/components/ComparisonView";
import { ProjectModal } from "@/components/ProjectModal";
import { useImagePairs } from "@/hooks/useImagePairs";
import { ViewHeader } from "@/components/ui/ViewHeader";
import { IconButton } from "@/components/ui/IconButton";
import { Refresh } from "@/components/ui/icons";

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
    openUnmatched,
    closePair,
    activeUnmatched,
    getDiff,
    ensureDiff,
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

  if (phase === "comparing" && activeUnmatched) {
    return (
      <>
        <SingleImageView
          file={activeUnmatched.file}
          side={activeUnmatched.side}
          projectName={projectName}
          onClose={closePair}
        />
        {projectModal}
      </>
    );
  }

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
          onEnsureDiff={ensureDiff}
        />
        {projectModal}
      </>
    );
  }

  if (phase === "pairing") {
    return (
      <div className="flex h-screen flex-col">
        <div className="flex items-center gap-3 p-4 pb-0">
          <ViewHeader projectName={projectName} onBack={newProject} backTitle="Back to folder picker">
            <span className="text-sm text-zinc-600">
              {left.folderName} → {right.folderName}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <IconButton onClick={refresh} disabled={refreshing} title="Refresh images">
                <Refresh className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </IconButton>
              <button
                onClick={() => setShowProjectModal(true)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-900"
              >
                Projects
              </button>
            </div>
          </ViewHeader>
        </div>
        <PairList
          pairs={pairs}
          unmatched={unmatched}
          onOpen={openPair}
          onRemove={removePair}
          onManualPair={manualPair}
          onOpenUnmatched={openUnmatched}
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
