<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# bootstrap

## Purpose
Bootstrap SCSS configuration layer. Overrides Bootstrap's default Sass variables before the framework is imported, and applies targeted component-level overrides after import. Controls the visual baseline (colours, spacing, typography scale) for the entire app.

## Key Files

| File | Description |
|------|-------------|
| `_pre_defaults.scss` | Variable overrides applied *before* Bootstrap is imported — sets brand colours, font sizes, and spacing tokens |
| `_config.scss` | Additional Bootstrap configuration — enables or disables optional Bootstrap modules |
| `_bootstrap-overrides.scss` | Post-import overrides that patch Bootstrap component styles not controllable via variables |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Per-component Bootstrap override partials (see `components/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Variable overrides **must** go in `_pre_defaults.scss` — Bootstrap reads them before compiling its own styles. Placing overrides after the Bootstrap import has no effect on variables.
- Use `_bootstrap-overrides.scss` only for structural/CSS overrides that variables cannot address.
- Import order in the parent entry file matters: pre-defaults → Bootstrap → overrides.

### Testing Requirements
- Visual regression check in the browser after changes. No automated snapshot tests configured.

### Common Patterns
- Override Bootstrap variables using `$variable-name: value;` (no `!default`).
- Use Bootstrap's spacing scale (`$spacer`, `$spacers`) and colour map (`$theme-colors`) as extension points.

## Dependencies

### External
- `bootstrap` — source SCSS imported after `_pre_defaults.scss`
- `sass` — compiler

<!-- MANUAL: -->
