<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# components

## Purpose
Custom SCSS partials for individual UI components in the application theme. Each partial styles a specific UI element beyond what Bootstrap provides.

## Key Files

| File | Description |
|------|-------------|
| `_navbar.scss` | Custom styles for the `hgv-navbar` — layout, branding colours, and responsive adjustments |
| `_header.scss` | Page header / hero section styles used on authenticated pages |
| `_single-record-sidebar.scss` | Sidebar layout and styles for the record Show page — displays summary info alongside the main record content |

## For AI Agents

### Working In This Directory
- Add a new partial here for each new UI component that needs custom styling; import it in `src/scss/theme/app.scss`.
- Naming convention: `_<component-name>.scss` matching the React component name where possible.
- Avoid duplicating styles that Bootstrap already provides — extend Bootstrap classes rather than rewriting from scratch.

### Testing Requirements
- Visual inspection across the pages that render the styled component, including mobile breakpoints.

### Common Patterns
- Use BEM-style class naming or Bootstrap utility classes for structure; reserve custom classes for genuinely unique styles.
- Reference SCSS variables from the bootstrap layer (e.g. `$primary`, `$spacer`) to stay in sync with the design token set.

## Dependencies

### Internal
- Styles here target elements rendered by components in `src/components/` and `src/pages/`

### External
- `bootstrap` — utility classes and variables referenced

<!-- MANUAL: -->
