import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ImagePair, UnmatchedFile, AppPhase, ComparisonMode } from "@/lib/types";
import { matchFiles } from "@/lib/matchFiles";
import {
  listProjects,
  deleteProject,
  saveProject,
  getProject,
  saveSession,
  getSession,
  clearSession,
  ProjectMeta,
} from "@/lib/projectStore";
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
  const [mode, setMode] = useState<ComparisonMode>("side-by-side");
  const [refreshing, setRefreshing] = useState(false);
  const { getDiff, ensureDiff } = useDiffCache(pairs);

  const didInit = useRef(false);
  const pendingPairIndex = useRef<number | null>(null);

  // Load project list on mount
  useEffect(() => {
    setProjects(listProjects());
  }, []);

  // Auto-restore session (once)
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const session = getSession();
    if (!session) return;

    setProjectName(session.projectName);
    setMode(session.mode);
    if (session.activePairIndex !== null) {
      pendingPairIndex.current = session.activePairIndex;
    }

    Promise.all([
      left.restore(session.leftPath),
      right.restore(session.rightPath),
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-compare when both sides have files (initial restore + file watcher updates)
  const didAutoCompare = useRef(false);
  useEffect(() => {
    if (!didInit.current) return;
    if (left.files.length === 0 || right.files.length === 0) return;

    const result = matchFiles(left.files, right.files);
    setPairs(result.pairs);
    setUnmatched(result.unmatched);
    if (!didAutoCompare.current) setPhase("pairing");
    didAutoCompare.current = true;
  }, [left.files, right.files]);

  // Open pending pair after pairs populate (from restored session)
  const didOpenPair = useRef(false);
  useEffect(() => {
    if (didOpenPair.current) return;
    if (pendingPairIndex.current === null) return;
    if (pairs.length === 0) return;
    didOpenPair.current = true;

    const idx = pendingPairIndex.current;
    if (idx >= 0 && idx < pairs.length) {
      setActivePairId(pairs[idx].id);
      setPhase("comparing");
    }
  }, [pairs]);

  // Auto-persist session on every state change
  useEffect(() => {
    if (!didAutoCompare.current) return;
    if (!left.dirPath || !right.dirPath) return;

    const pairIdx = activePairId
      ? pairs.findIndex((p) => p.id === activePairId)
      : null;

    saveSession({
      projectName,
      leftPath: left.dirPath,
      rightPath: right.dirPath,
      activePairIndex: pairIdx !== undefined && pairIdx !== -1 ? pairIdx : null,
      mode,
    });
  }, [projectName, activePairId, pairs, mode, left.dirPath, right.dirPath]);

  const restoreProject = useCallback(
    async (name: string) => {
      const project = getProject(name);
      if (!project) return;
      setProjectName(name);
      didAutoCompare.current = false;
      setActivePairId(null);
      setPairs([]);
      setUnmatched([]);
      setPhase("idle");
      await Promise.all([
        left.restore(project.leftPath),
        right.restore(project.rightPath),
      ]);
    },
    [left.restore, right.restore]
  );

  const compare = useCallback(() => {
    const result = matchFiles(left.files, right.files);
    setPairs(result.pairs);
    setUnmatched(result.unmatched);
    setPhase("pairing");
    if (left.dirPath && right.dirPath) {
      saveProject(projectName, left.dirPath, right.dirPath);
    }
    didAutoCompare.current = true;
  }, [left.files, right.files, left.dirPath, right.dirPath, projectName]);

  const saveAsProject = useCallback(
    (name: string) => {
      setProjectName(name);
      if (left.dirPath && right.dirPath) {
        saveProject(name, left.dirPath, right.dirPath);
      }
      setProjects(listProjects());
    },
    [left.dirPath, right.dirPath]
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([left.refresh(), right.refresh()]);
    setRefreshing(false);
  }, [left.refresh, right.refresh]);

  const removeProject = useCallback((name: string) => {
    deleteProject(name);
    setProjects(listProjects());
  }, []);

  const newProject = useCallback(() => {
    setProjectName("default");
    setActivePairId(null);
    setPairs([]);
    setUnmatched([]);
    setPhase("idle");
    setMode("side-by-side");
    didAutoCompare.current = false;
    left.reset();
    right.reset();
    clearSession();
  }, [left.reset, right.reset]);

  const pickLeftFolder = useCallback(() => {
    left.pickFolder();
  }, [left.pickFolder]);

  const pickRightFolder = useCallback(() => {
    right.pickFolder();
  }, [right.pickFolder]);

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
    mode,
    setMode,
    compare,
    refresh,
    refreshing,
    restoreProject,
    saveAsProject,
    removeProject,
    newProject,
    setProjectName,
    manualPair,
    removePair,
    openPair,
    closePair,
    getDiff,
    ensureDiff,
  };
}
