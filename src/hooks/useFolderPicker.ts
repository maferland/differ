import { useState, useCallback, useRef } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";
import { convertFileSrc } from "@tauri-apps/api/core";
import { ImageFile } from "@/lib/types";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);

function normalizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  return base.toLowerCase().replace(/[\s_-]+/g, "");
}

async function readImageFiles(dirPath: string, cacheBust: number): Promise<ImageFile[]> {
  const entries = await readDir(dirPath);
  const files: ImageFile[] = [];
  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    const filePath = `${dirPath}/${entry.name}`;
    files.push({
      name: entry.name,
      normalizedName: normalizeFilename(entry.name),
      path: filePath,
      objectUrl: `${convertFileSrc(filePath)}?t=${cacheBust}`,
    });
  }
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

export function useFolderPicker(_side: "left" | "right") {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [dirPath, setDirPath] = useState<string | null>(null);
  const cacheBustRef = useRef(Date.now());

  const loadFromPath = useCallback(async (path: string, bust?: number) => {
    const imageFiles = await readImageFiles(path, bust ?? cacheBustRef.current);
    setFiles(imageFiles);
    setDirPath(path);
    setFolderName(path.split("/").pop() ?? path);
  }, []);

  const pickFolder = useCallback(async () => {
    const selected = await open({ directory: true, multiple: false });
    if (!selected) return;
    await loadFromPath(selected);
  }, [loadFromPath]);

  const restore = useCallback(
    async (path: string) => {
      try {
        await loadFromPath(path);
        return true;
      } catch {
        return false;
      }
    },
    [loadFromPath]
  );

  const refresh = useCallback(async () => {
    if (!dirPath) return;
    cacheBustRef.current = Date.now();
    await loadFromPath(dirPath, cacheBustRef.current);
  }, [dirPath, loadFromPath]);

  const reset = useCallback(() => {
    setFiles([]);
    setFolderName(null);
    setDirPath(null);
  }, []);

  return { files, folderName, dirPath, pickFolder, restore, refresh, reset };
}
