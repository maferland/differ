<div align="center">

<img src="src-tauri/icons/icon.png" width="128" height="128" alt="Differ icon" />

# Differ

Desktop app for comparing images side-by-side with pixel-level diffing

[![CI](https://github.com/maferland/differ/actions/workflows/ci.yml/badge.svg)](https://github.com/maferland/differ/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/maferland/differ)](https://github.com/maferland/differ/releases/latest)

<img src="web/screenshot.png" width="720" alt="Differ — side-by-side comparison view" />

https://github.com/maferland/differ/raw/refs/heads/main/web/demo.mp4

</div>

---

Pick two folders, auto-match images by filename, and compare them with three modes:

- **Side-by-side** — Synchronized scroll and zoom, horizontal or vertical layout
- **Pixel diff** — pixelmatch-powered overlay with diff percentage
- **Slider** — Draggable overlay to reveal differences

Save folder pairs as named projects. Session auto-restores on relaunch.

## Install

```sh
brew install maferland/tap/differ
```

Or download the `.dmg` from [Releases](https://github.com/maferland/differ/releases/latest).

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)

```sh
git clone https://github.com/maferland/differ
cd differ
npm install
npm run tauri dev
```

### Build

```sh
npm run tauri build
```

Produces `.app` and `.dmg` in `src-tauri/target/release/bundle/`.

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/maferland)

## License

[MIT](LICENSE)
