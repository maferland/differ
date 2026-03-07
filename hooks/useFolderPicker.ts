"use client";

import { useState, useCallback, useRef } from "react";
import { ImageFile } from "@/lib/types";
import { saveHandle, restoreHandle } from "@/lib/handleStore";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);

function normalizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  return base.toLowerCase().replace(/[\s_-]+/g, "");
}

async function readImageFiles(
  dirHandle: FileSystemDirectoryHandle
): Promise<ImageFile[]> {
  const files: ImageFile[] = [];
  for await (const entry of dirHandle.values()) {
    if (entry.kind !== "file") continue;
    const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
    if (!IMAGE_EXTENSIONS.has(ext)) continue;
    const file = await entry.getFile();
    files.push({
      name: entry.name,
      normalizedName: normalizeFilename(entry.name),
      file,
      objectUrl: URL.createObjectURL(file),
    });
  }
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

export function useFolderPicker(side: "left" | "right") {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [folderName, setFolderName] = useState<string | null>(null);
  const prevUrls = useRef<string[]>([]);
  const dirHandleRef = useRef<FileSystemDirectoryHandle | null>(null);
  const projectRef = useRef<string>("default");

  const loadFromHandle = useCallback(async (dirHandle: FileSystemDirectoryHandle) => {
    prevUrls.current.forEach((url) => URL.revokeObjectURL(url));
    dirHandleRef.current = dirHandle;
    const imageFiles = await readImageFiles(dirHandle);
    prevUrls.current = imageFiles.map((f) => f.objectUrl);
    setFiles(imageFiles);
    setFolderName(dirHandle.name);
  }, []);

  const pickFolder = useCallback(async (project: string) => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      projectRef.current = project;
      await saveHandle(project, side, dirHandle);
      await loadFromHandle(dirHandle);
    } catch {
      // User cancelled
    }
  }, [side, loadFromHandle]);

  const restore = useCallback(async (project: string) => {
    try {
      projectRef.current = project;
      const handle = await restoreHandle(project, side);
      if (handle) await loadFromHandle(handle);
      return !!handle;
    } catch {
      return false;
    }
  }, [side, loadFromHandle]);

  const refresh = useCallback(async () => {
    if (dirHandleRef.current) {
      await loadFromHandle(dirHandleRef.current);
    }
  }, [loadFromHandle]);

  return { files, folderName, pickFolder, refresh, restore };
}
