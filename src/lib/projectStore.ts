import { ComparisonMode } from "./types";

const PROJECTS_KEY = "image-diff:projects";
const SESSION_KEY = "image-diff:session";

export interface ProjectMeta {
  name: string;
  createdAt: number;
  leftPath: string;
  rightPath: string;
}

export interface SessionState {
  projectName: string;
  leftPath: string;
  rightPath: string;
  activePairIndex: number | null;
  mode: ComparisonMode;
}

function readProjects(): ProjectMeta[] {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeProjects(projects: ProjectMeta[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function saveProject(
  name: string,
  leftPath: string,
  rightPath: string
): void {
  const projects = readProjects().filter((p) => p.name !== name);
  projects.unshift({ name, createdAt: Date.now(), leftPath, rightPath });
  writeProjects(projects);
}

export function getProject(name: string): ProjectMeta | null {
  return readProjects().find((p) => p.name === name) ?? null;
}

export function listProjects(): ProjectMeta[] {
  return readProjects().sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteProject(name: string): void {
  writeProjects(readProjects().filter((p) => p.name !== name));
}

export function saveSession(state: SessionState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {}
}

export function getSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}
