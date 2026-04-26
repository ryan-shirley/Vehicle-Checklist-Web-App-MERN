<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# scss

## Purpose
SCSS stylesheets split into two concerns: Bootstrap configuration/overrides and the custom application theme. Both are imported via `src/App.scss` which is the single SCSS entry point for the build.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `bootstrap/` | Bootstrap variable overrides, pre-defaults, and component-level Bootstrap customisations (see `bootstrap/AGENTS.md`) |
| `theme/` | Custom application theme — typography, component styles, and layout (see `theme/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All SCSS is compiled by the CRA Webpack build via `src/App.scss`. Do not add `<link>` tags for stylesheets manually.
- To change Bootstrap defaults (colours, spacing, breakpoints), edit files in `bootstrap/` before Bootstrap is imported.
- Custom component styles belong in `theme/components/`; global text/typography rules go in `theme/_text.scss`.
- SCSS partials use the `_` prefix convention; import them explicitly via `@use` or `@import` in the relevant entry file.

### Testing Requirements
- Visual inspection in the browser after `npm start` is the primary test. No automated CSS regression tests are configured.

### Common Patterns
- Bootstrap variables are overridden in `bootstrap/_pre_defaults.scss` (before Bootstrap import) and `bootstrap/_config.scss`.
- Component-specific overrides of Bootstrap defaults live in `bootstrap/_bootstrap-overrides.scss`.

## Dependencies

### External
- `bootstrap` — base CSS framework imported after variable overrides
- `sass` — SCSS compiler provided by CRA

<!-- MANUAL: -->
