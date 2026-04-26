<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# workflows

## Purpose
GitHub Actions workflow definitions for automated CI/CD and security analysis. Three workflows cover React UI deployment, Cloud Functions deployment, and code security scanning.

## Key Files

| File | Description |
|------|-------------|
| `react-ui-deployment.yml` | Builds and deploys the React app to Firebase Hosting on push to master |
| `cloud-functions.yml` | Deploys the Express backend as a Firebase Cloud Function on push to master |
| `codeql-analysis.yml` | Runs GitHub CodeQL security scanning on the JavaScript codebase |

## For AI Agents

### Working In This Directory
- Deployment workflows trigger on push to `master` — changes to workflows take effect on the next push.
- Firebase deploy tokens and service account credentials must be stored as GitHub Actions secrets; check the workflow YAML for the expected secret names before adding new deployment steps.
- Do not hardcode credentials or environment values in workflow files; use `${{ secrets.SECRET_NAME }}` references.

### Testing Requirements
- Workflow syntax can be validated locally with `act` (optional) or inspected via the GitHub Actions UI after pushing.

### Common Patterns
- Both deployment workflows run `npm ci` then `npm run build` for the React app before deploying.
- CodeQL workflow runs on push and pull request events for the `master` branch.

<!-- MANUAL: -->
