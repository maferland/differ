<div align="center">
<h1>🔍 Image Diff</h1>

<p>Compare images side-by-side with pixel-level diffing</p>
</div>

---

Pick two folders, auto-match images by filename, and compare them via side-by-side view, pixel diff, or slider overlay.

## Prerequisites

- Chrome or Edge (requires File System Access API)

## Install

```sh
git clone https://github.com/maferland/image-diff
cd image-diff
npm install
```

## Usage

```sh
npm run dev
```

Open `http://localhost:3000`. Select two folders, click Compare.

- **Side-by-side** — Synchronized scroll and zoom
- **Pixel diff** — pixelmatch-powered with diff percentage
- **Slider** — Draggable overlay to reveal differences

Save folder pairs as named projects for quick access later.

## License

[MIT](LICENSE)
