<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# models

## Purpose
Mongoose schema definitions for all MongoDB collections used by the application. Each file defines a schema and exports a Mongoose model that route handlers use to query and mutate data.

## Key Files

| File | Description |
|------|-------------|
| `User.js` | Schema for application users — stores Firebase UID, name, email, and role |
| `Plant.js` | Schema for plant/depot locations that records are associated with |
| `CheckList.js` | Schema for checklist templates — defines which check groups and items apply to a vehicle type |
| `CheckGroup.js` | Schema for a named group of check items within a checklist |
| `Record.js` | Schema for a completed inspection record — links a user, plant, checklist, and timestamped responses |

## For AI Agents

### Working In This Directory
- Follow the existing Mongoose pattern: define a `Schema`, attach it to `mongoose.model('ModelName', schema)`, and export the model.
- Add indexes on fields used in frequent queries (e.g., `userId`, `plantId`) to avoid full collection scans.
- When modifying a schema, consider backward compatibility — existing documents in MongoDB will not be migrated automatically.

### Testing Requirements
- Use an in-memory MongoDB instance (e.g., `mongodb-memory-server`) for unit testing models to avoid hitting the real database.

### Common Patterns
- References between documents use `ObjectId` with `ref: 'ModelName'` for Mongoose population.
- Timestamps (`createdAt`, `updatedAt`) are enabled with `{ timestamps: true }` in schema options where relevant.

## Dependencies

### External
- `mongoose` — ODM for schema definition and querying

<!-- MANUAL: -->
