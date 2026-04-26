<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# components

## Purpose
Bootstrap component-level SCSS overrides that cannot be achieved through variable customisation alone. Each partial targets a specific Bootstrap component.

## Key Files

| File | Description |
|------|-------------|
| `_tables.scss` | Overrides for Bootstrap table styles — custom borders, row colours, or density adjustments |

## For AI Agents

### Working In This Directory
- Add a new partial here only when a Bootstrap component needs structural CSS changes that variables in `_pre_defaults.scss` cannot address.
- Name partials after the Bootstrap component they override (e.g. `_buttons.scss`, `_cards.scss`) and import them in the parent `_bootstrap-overrides.scss`.

### Testing Requirements
- Visual check in the browser on pages that use the affected Bootstrap component.

### Common Patterns
- Use Bootstrap's own class selectors (`.table`, `.table-striped`) to scope overrides precisely and avoid unintended side effects.

## Dependencies

### External
- `bootstrap` — selectors referenced here must match the Bootstrap version in use

<!-- MANUAL: -->
