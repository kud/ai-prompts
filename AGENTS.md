# Agents

This repository is a curated collection of AI prompt YAML files that are built into distributable formats (Raycast and Espanso). It ships TypeScript/JavaScript source plus a JSON schema and tests.

## Structure

- prompts/: individual prompt YAML files
- src/: build/validation logic and schema
- tests/: Vitest test suite
- dist/: build outputs (generated)

## Common tasks

- Install: npm install
- Build: npm run build
- Test: npm test
- Lint/format: npm run lint / npm run format

## Adding a prompt

1. Add a new YAML file in prompts/ following the schema in src/schema.json.
2. Run npm test and npm run build.
3. Ensure generated outputs are correct.
