"use client";

import { useCallback, useEffect, useState } from "react";
import { FolderPicker } from "@/components/FolderPicker";
import { PairList } from "@/components/PairList";
import { ComparisonView } from "@/components/ComparisonView";
import { SaveProjectModal } from "@/components/SaveProjectModal";
import { useImagePairs } from "@/hooks/useImagePairs";

export default function Home() {
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
    recompare,
    restoreProject,
    saveAsProject,
    removeProject,
    setProjectName,
    manualPair,
    removePair,
    openPair,
    closePair,
    getDiff,
  } = useImagePairs();

  const [refreshing, setRefreshing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    recompare();
    setRefreshing(false);
  }, [refresh, recompare]);

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

  if (phase === "comparing" && activePair) {
    return (
      <ComparisonView
        pair={activePair}
        pairIndex={activePairIndex}
        totalPairs={pairs.length}
        onClose={closePair}
        onNavigate={navigate}
        cachedDiff={getDiff(activePair.id)}
      />
    );
  }

  if (phase === "pairing") {
    return (
      <div>
        <div className="flex items-center justify-end gap-2 p-4 pb-0">
          <span className="mr-auto text-sm text-zinc-500">
            {projectName !== "default" && projectName}
          </span>
          <button
            onClick={() => setShowSaveModal(true)}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-900"
          >
            Save Project
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-900 disabled:opacity-40"
          >
            {refreshing ? "Refreshing..." : "Refresh Files"}
          </button>
        </div>
        <PairList
          pairs={pairs}
          unmatched={unmatched}
          onOpen={openPair}
          onRemove={removePair}
          onManualPair={manualPair}
        />
        <SaveProjectModal
          open={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveProject}
          defaultName={projectName !== "default" ? projectName : ""}
        />
      </div>
    );
  }

  return (
    <FolderPicker
      left={left}
      right={right}
      canCompare={canCompare}
      projects={projects}
      onCompare={compare}
      onRestoreProject={restoreProject}
      onDeleteProject={removeProject}
    />
  );
}
