# Image Diff

Compare images side-by-side with pixel-level diffing. Pick two folders, auto-match by filename, manually pair unmatched files, and compare via three modes.

## Features

- **Side-by-side** — Synchronized scroll, shared zoom, size-matched images
- **Pixel diff** — pixelmatch-powered diffing with percentage stats
- **Slider overlay** — Draggable handle to reveal differences
- **Projects** — Save/restore folder pairs by name (IndexedDB + File System Access API)
- **Auto-refresh** — Re-read folders without re-picking

## Tech Stack

Next.js (App Router), TypeScript, Tailwind CSS, pixelmatch, @tanstack/react-virtual

## Getting Started

```sh
npm install
npm run dev
```

Open `http://localhost:3000` in Chrome or Edge (requires File System Access API).

## Deploy

Deployed via Vercel. Push to `main` to trigger a deploy.

## Browser Support

Chrome and Edge only — requires the File System Access API (`showDirectoryPicker`).
