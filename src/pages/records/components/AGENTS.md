<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# components

## Purpose
Sub-components shared between the Create and Edit record pages. Encapsulates the interactive form logic for check groups and individual check inputs, keeping the parent page components lean.

## Key Files

| File | Description |
|------|-------------|
| `GroupList.js` | Renders a list of check groups for the selected checklist — allows expanding/collapsing groups and iterating over their checks |
| `ChecksForms.js` | Renders the input controls for individual check items within a group — handles pass/fail/comment fields |

## For AI Agents

### Working In This Directory
- These components receive checklist data as props from `Create.js` / `Edit.js` and call back via handler props to update parent state — keep them controlled (prop-driven) rather than holding their own server state.
- When adding a new field type to inspection checks, update `ChecksForms.js` and ensure the corresponding schema change is made in `backend/models/CheckGroup.js`.

### Testing Requirements
- Unit test with React Testing Library by passing mock checklist data as props and asserting correct field rendering and callback invocation.

### Common Patterns
- Controlled components: all input values and change handlers flow down from the parent page via props.
- `GroupList.js` maps over an array of group objects; `ChecksForms.js` maps over the checks array within a group.

## Dependencies

### Internal
- Consumed by `src/pages/records/Create.js` and `src/pages/records/Edit.js`

### External
- `react` — hooks for local UI state (e.g. expand/collapse toggle)

<!-- MANUAL: -->
