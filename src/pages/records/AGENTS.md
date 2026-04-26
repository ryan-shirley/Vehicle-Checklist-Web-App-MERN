<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# records

## Purpose
Page-level components for the full CRUD lifecycle of inspection records: creating a new record, editing an existing one, and viewing a completed record. Each page communicates with the `records` backend route.

## Key Files

| File | Description |
|------|-------------|
| `Create.js` | Form page for submitting a new vehicle inspection record — selects plant, checklist, and fills in check responses |
| `Edit.js` | Form page for modifying an existing inspection record — pre-populates fields from the stored record |
| `Show.js` | Read-only view of a completed inspection record — displays all check groups and responses |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Sub-components shared between Create and Edit pages (see `components/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All three pages are mounted as child routes of `/records` in `src/App.js` — e.g. `/records/create`, `/records/:id`, `/records/:id/edit`.
- API calls use the Firebase ID token; fetch it with `await firebase.auth().currentUser.getIdToken()` before each request.
- `Create.js` and `Edit.js` share checklist form logic via components in `records/components/` — prefer modifying the shared components over duplicating logic.

### Testing Requirements
- Test with mocked backend responses for loading, submit success, and submit error states.
- Verify route params (`useParams`) are correctly read in `Edit.js` and `Show.js`.

### Common Patterns
- `Create.js` and `Edit.js` manage local form state with `useState`; on submit they POST/PUT to `/api/records`.
- `Show.js` fetches a single record on mount using `useEffect` with the record ID from `useParams`.

## Dependencies

### Internal
- `records/components/GroupList.js` and `ChecksForms.js` — form sub-components used by Create and Edit
- `src/components/hgv-navbar.js` — navigation bar rendered on all record pages

### External
- `react-router-dom` — `useParams`, `useHistory`
- `firebase` — Auth token retrieval

<!-- MANUAL: -->
