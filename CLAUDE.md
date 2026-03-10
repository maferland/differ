# Differ

Tauri v2 desktop app. Vite + React frontend, Rust backend. All image processing in-browser.

## Stack

- **Frontend:** Vite + React 19 + Tailwind v4 (`src/`)
- **Backend:** Tauri v2 (`src-tauri/`) — dialog + fs plugins
- **Build:** `npm run tauri dev` (dev) / `npm run tauri build` (release)

## Non-obvious

- Projects persisted in localStorage via `lib/projectStore.ts` (stores folder path strings)
- Pixel diffs computed lazily on demand via `useDiffCache` (not eagerly)
- Images normalized by scaling to max dimensions before pixelmatch (not padding)
- Images served via `asset://` protocol (`convertFileSrc()`) with `?t=` cache busting for refresh
- Folder picker uses `@tauri-apps/plugin-dialog` (`open({ directory: true })`)
- File listing uses `@tauri-apps/plugin-fs` (`readDir()`)
- Session auto-persists to localStorage and restores on relaunch

## Deploy

`npm run tauri build` produces `.app` and `.dmg` in `src-tauri/target/release/bundle/`.

CI builds and notarizes on push to `release` branch via GitHub Actions.
