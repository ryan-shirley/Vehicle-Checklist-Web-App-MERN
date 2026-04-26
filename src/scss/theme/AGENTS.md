<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# theme

## Purpose
Custom application theme styles that sit on top of Bootstrap. Defines global typography rules, app-level layout, and per-component custom styles not achievable through Bootstrap variable overrides alone.

## Key Files

| File | Description |
|------|-------------|
| `app.scss` | Main theme entry point — imports all theme partials in order |
| `_text.scss` | Global typography rules — font families, weights, line-heights, and heading styles |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Per-component theme partials for navbar, header, sidebar, etc. (see `components/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Add new component styles as a new partial in `components/` and import it in `app.scss`.
- Global text/typography changes belong in `_text.scss`; avoid scattering font rules across component files.
- Theme styles are applied after Bootstrap — selectors here take precedence over Bootstrap defaults without needing `!important`.

### Testing Requirements
- Visual inspection in the browser. Check across the major page types (Login, Home, Show record) after changes.

### Common Patterns
- Partials follow the `_component-name.scss` naming convention.
- Use Bootstrap CSS custom properties (`--bs-*`) or SCSS variables from the bootstrap layer for consistency.

## Dependencies

### Internal
- Relies on Bootstrap variables defined in `src/scss/bootstrap/` being compiled first

### External
- `sass` — compiler

<!-- MANUAL: -->
