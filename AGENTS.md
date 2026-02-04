# Agents

Curated AI prompt YAMLs built into Raycast and Espanso distributions. Ships TypeScript/JavaScript sources, JSON schema, and tests.

## Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0

## Structure

- prompts/: prompt YAMLs
- src/: build + validation logic and schema
- tests/: Vitest suite
- dist/: generated outputs

## Common tasks

- Install: npm install
- Build: npm run build
- Dev: npm run dev
- Test: npm test
- Lint/format: npm run lint / npm run format

## Add a prompt

1. Create a YAML file in prompts/ that matches src/schema.json.
2. Run npm test and npm run build.
3. Verify dist/ outputs for Raycast and Espanso.
