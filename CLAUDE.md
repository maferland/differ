# Image Diff

Single-page client-only Next.js app. No API routes. All image processing in-browser.

## Non-obvious

- Projects persisted in IndexedDB via `lib/handleStore.ts` (stores `FileSystemDirectoryHandle`)
- Pixel diffs pre-computed eagerly for all pairs via `useDiffCache`
- Images normalized by scaling to max dimensions before pixelmatch (not padding)
- File System Access API requires Chrome/Edge

## Deploy

Vercel auto-deploy on push to main. No CI pipeline.
