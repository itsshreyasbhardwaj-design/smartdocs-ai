# Contributing to SmartDocs

Thanks for considering a contribution!

## Getting started

```bash
git clone https://github.com/itsshreyasbhardwaj-design/smartdocs-ai.git
cd smartdocs-ai
pnpm install
pnpm dev
```

No API keys are required — SmartDocs runs entirely on its built-in local
documentation generator by default. See [`.env.example`](./.env.example) if
you want to develop against the OpenRouter integration.

## Development workflow

- `pnpm dev` — start the dev server
- `pnpm test` — run the Vitest suite
- `pnpm lint` — run ESLint
- `pnpm build` — production build

Please run `pnpm lint && pnpm test && pnpm build` before opening a PR.

## Commit style

This repo uses [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, ...).

## Adding a new document type

Document generation is template-driven — see [`src/lib/docs`](./src/lib/docs):

1. Add the type to `DocType` and `DOC_TYPES` in `types.ts`.
2. Add a generator function in `templates.ts` that turns a `RepoAnalysis`
   into grounded Markdown.
3. Add a test in `templates.test.ts` asserting it's grounded in the fixture
   analysis, not hallucinated.

## Adding a new AI provider

Implement the `AIProvider` interface in `src/lib/ai/types.ts` and wire it
into the factory in `src/lib/ai/index.ts`.

## Pull requests

- Keep PRs focused on a single change.
- Add or update tests for behavior changes.
- Describe what changed and why in the PR description.
