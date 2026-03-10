<div align="center">
<h1>Differ</h1>

<p>Desktop app for comparing images side-by-side with pixel-level diffing</p>

[![CI](https://github.com/maferland/diff/actions/workflows/ci.yml/badge.svg)](https://github.com/maferland/diff/actions/workflows/ci.yml)

</div>

---

Pick two folders, auto-match images by filename, and compare them with three modes:

- **Side-by-side** — Synchronized scroll and zoom, horizontal or vertical layout
- **Pixel diff** — pixelmatch-powered overlay with diff percentage
- **Slider** — Draggable overlay to reveal differences

Save folder pairs as named projects. Session auto-restores on relaunch.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)

## Install

```sh
git clone https://github.com/maferland/diff
cd diff
npm install
```

## Development

```sh
npm run tauri dev
```

## Build

```sh
npm run tauri build
```

Produces `.app` and `.dmg` in `src-tauri/target/release/bundle/`.

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/maferland)

## License

[MIT](LICENSE)
