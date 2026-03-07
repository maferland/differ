const DB_NAME = "image-diff";
const STORE_NAME = "dir-handles";
const META_STORE = "projects";
const DB_VERSION = 2;

export interface ProjectMeta {
  name: string;
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function projectKey(project: string, side: string) {
  return `${project}::${side}`;
}

export async function saveHandle(
  project: string,
  side: string,
  handle: FileSystemDirectoryHandle
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME, META_STORE], "readwrite");
    tx.objectStore(STORE_NAME).put(handle, projectKey(project, side));
    tx.objectStore(META_STORE).put(
      { name: project, createdAt: Date.now() } satisfies ProjectMeta,
      project
    );
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function restoreHandle(
  project: string,
  side: string
): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDB();
  const handle = await new Promise<FileSystemDirectoryHandle | null>(
    (resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(projectKey(project, side));
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    }
  );
  if (!handle) return null;
  const perm = await (handle as any).requestPermission({ mode: "read" });
  if (perm !== "granted") return null;
  return handle;
}

export async function listProjects(): Promise<ProjectMeta[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readonly");
    const req = tx.objectStore(META_STORE).getAll();
    req.onsuccess = () =>
      resolve(
        (req.result as ProjectMeta[]).sort((a, b) => b.createdAt - a.createdAt)
      );
    req.onerror = () => reject(req.error);
  });
}

export async function deleteProject(name: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME, META_STORE], "readwrite");
    tx.objectStore(STORE_NAME).delete(projectKey(name, "left"));
    tx.objectStore(STORE_NAME).delete(projectKey(name, "right"));
    tx.objectStore(META_STORE).delete(name);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const LAST_PROJECT_KEY = "image-diff:last-project";

export function getLastProject(): string | null {
  try {
    return localStorage.getItem(LAST_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function setLastProject(name: string) {
  try {
    localStorage.setItem(LAST_PROJECT_KEY, name);
  } catch {}
}
