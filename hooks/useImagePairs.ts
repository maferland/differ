"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ImagePair, UnmatchedFile, AppPhase } from "@/lib/types";
import { matchFiles } from "@/lib/matchFiles";
import {
  listProjects,
  getLastProject,
  setLastProject,
  deleteProject,
  ProjectMeta,
} from "@/lib/handleStore";
import { useFolderPicker } from "./useFolderPicker";
import { useDiffCache } from "./useDiffCache";

export function useImagePairs() {
  const left = useFolderPicker("left");
  const right = useFolderPicker("right");
  const [pairs, setPairs] = useState<ImagePair[]>([]);
  const [unmatched, setUnmatched] = useState<UnmatchedFile[]>([]);
  const [activePairId, setActivePairId] = useState<string | null>(null);
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [projectName, setProjectName] = useState<string>("default");
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const { getDiff, invalidate: invalidateDiffs } = useDiffCache(pairs);
  const autoRestored = useRef(false);

  // Load project list on mount
  useEffect(() => {
    listProjects().then(setProjects).catch(() => {});
  }, []);

  // Auto-restore last project on mount
  useEffect(() => {
    if (autoRestored.current) return;
    autoRestored.current = true;
    const last = getLastProject();
    if (!last) return;
    restoreProject(last);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const restoreProject = useCallback(
    async (name: string) => {
      setProjectName(name);
      const [leftOk, rightOk] = await Promise.all([
        left.restore(name),
        right.restore(name),
      ]);
      if (leftOk && rightOk) {
        setLastProject(name);
      }
    },
    [left.restore, right.restore]
  );

  const compare = useCallback(() => {
    const result = matchFiles(left.files, right.files);
    setPairs(result.pairs);
    setUnmatched(result.unmatched);
    setPhase("pairing");
    setLastProject(projectName);
  }, [left.files, right.files, projectName]);

  const refresh = useCallback(async () => {
    await Promise.all([left.refresh(), right.refresh()]);
  }, [left.refresh, right.refresh]);

  const recompare = useCallback(() => {
    invalidateDiffs();
    const result = matchFiles(left.files, right.files);
    setPairs(result.pairs);
    setUnmatched(result.unmatched);
  }, [left.files, right.files, invalidateDiffs]);

  const saveAsProject = useCallback(
    async (name: string) => {
      setProjectName(name);
      setLastProject(name);
      // Re-pick triggers save via useFolderPicker, but if folders already loaded
      // we need to save current handles — they're already saved from pickFolder
      const updated = await listProjects();
      setProjects(updated);
    },
    []
  );

  const removeProject = useCallback(async (name: string) => {
    await deleteProject(name);
    const updated = await listProjects();
    setProjects(updated);
  }, []);

  const pickLeftFolder = useCallback(() => {
    left.pickFolder(projectName);
  }, [left.pickFolder, projectName]);

  const pickRightFolder = useCallback(() => {
    right.pickFolder(projectName);
  }, [right.pickFolder, projectName]);

  const manualPair = useCallback(
    (leftName: string, rightName: string) => {
      const leftFile = unmatched.find(
        (u) => u.side === "left" && u.file.name === leftName
      );
      const rightFile = unmatched.find(
        (u) => u.side === "right" && u.file.name === rightName
      );
      if (!leftFile || !rightFile) return;

      const newPair: ImagePair = {
        id: `${leftFile.file.name}__${rightFile.file.name}`,
        left: leftFile.file,
        right: rightFile.file,
      };
      setPairs((prev) => [...prev, newPair]);
      setUnmatched((prev) =>
        prev.filter(
          (u) =>
            !(u.side === "left" && u.file.name === leftName) &&
            !(u.side === "right" && u.file.name === rightName)
        )
      );
    },
    [unmatched]
  );

  const removePair = useCallback((id: string) => {
    setPairs((prev) => {
      const pair = prev.find((p) => p.id === id);
      if (pair) {
        setUnmatched((u) => [
          ...u,
          { side: "left" as const, file: pair.left },
          { side: "right" as const, file: pair.right },
        ]);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const activePair = useMemo(
    () => pairs.find((p) => p.id === activePairId) ?? null,
    [pairs, activePairId]
  );

  const activePairIndex = useMemo(
    () => (activePairId ? pairs.findIndex((p) => p.id === activePairId) : -1),
    [pairs, activePairId]
  );

  const openPair = useCallback((id: string) => {
    setActivePairId(id);
    setPhase("comparing");
  }, []);

  const closePair = useCallback(() => {
    setActivePairId(null);
    setPhase("pairing");
  }, []);

  const canCompare = left.files.length > 0 && right.files.length > 0;

  return {
    left: { ...left, pickFolder: pickLeftFolder },
    right: { ...right, pickFolder: pickRightFolder },
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
  };
}
