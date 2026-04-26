<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# public

## Purpose
Static assets for the React application's HTML shell. These files are served directly by Firebase Hosting and are not processed by Webpack — changes here take effect immediately without a rebuild.

## Key Files

| File | Description |
|------|-------------|
| `index.html` | HTML shell that React mounts into; contains the `<div id="root">` mount point and meta tags |
| `favicon.ico` | Browser tab icon |
| `manifest.json` | PWA manifest — defines app name, icons, and display mode for "Add to Home Screen" |
| `robots.txt` | Search engine crawl directives |
| `logo192.png` | PWA icon (192×192) referenced by `manifest.json` |
| `logo512.png` | PWA icon (512×512) referenced by `manifest.json` |

## For AI Agents

### Working In This Directory
- Do not add application logic here; this directory is for static shell assets only.
- To change the page title or meta description, edit `index.html`.
- To update PWA metadata (name, theme color, icons), edit `manifest.json`.

### Testing Requirements
- No automated tests apply here. Visual inspection after `npm run build` is sufficient.

### Common Patterns
- React injects `<script>` and `<link>` tags into `index.html` automatically during build — do not add them manually.

## Dependencies

### External
- Served as-is by Firebase Hosting; no build step required for files in this directory.

<!-- MANUAL: -->
