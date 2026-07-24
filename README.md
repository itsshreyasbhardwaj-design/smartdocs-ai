# SmartDocs

![license](https://img.shields.io/badge/license-MIT-blue) ![node](https://img.shields.io/badge/node-18%2B-informational) ![tests](https://img.shields.io/badge/tests-vitest-6d28d9)

**Point SmartDocs at a GitHub repository. Get a complete, editable documentation suite back — in minutes, for $0.**

SmartDocs analyzes any public GitHub repository (framework, language, package
manager, testing setup, database, CI/CD, deployment target) and generates 15
grounded, editable documents: README, API reference, architecture overview,
folder structure, installation/setup guides, environment variable docs,
database docs, feature/component docs, onboarding guide, deployment guide,
FAQ, contributing guide, and a changelog scaffold.

It runs with **zero configuration and zero API keys** — a built-in local
generator produces real, fact-grounded documentation from the repository
analysis. Plug in an [OpenRouter](https://openrouter.ai) key to have an LLM
polish the prose without changing the facts.

## Screenshots

> _Add screenshots of the landing page and dashboard here (`docs/screenshots/`)._

## Features

- **Deep repository analysis** — language, framework, package manager, testing
  framework, database/ORM, CI provider, and deployment target, detected from
  the repo's file tree and manifests (no config required).
- **15 document types generated together**, not fifteen disconnected files.
- **Modular AI provider architecture** — a free local generator by default
  (`src/lib/ai/mock-provider.ts`), or a real LLM via OpenRouter
  (`src/lib/ai/openrouter-provider.ts`), selected automatically based on
  whether `OPENROUTER_API_KEY` is set.
- **Streaming generation** — documents stream into the UI as they're written.
- **Full Markdown editor** with live preview for every generated document.
- **Export to Markdown, HTML, or DOCX.**
- **Local project history** — generated projects persist in the browser via
  `localStorage` (see `src/store/project-store.ts`), no account required.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| State | Zustand (persisted to `localStorage`) |
| Repo analysis | Octokit (GitHub REST API) |
| AI | Modular provider interface — local generator + OpenRouter |
| Markdown | react-markdown, remark-gfm, marked (server-side HTML/DOCX export) |
| Export | Markdown, HTML, DOCX (`html-to-docx`) |
| Testing | Vitest, Testing Library |
| Package manager | pnpm |
| Linting | ESLint |

## Architecture

```
┌──────────────┐     ┌─────────────────────┐     ┌────────────────────┐
│   Dashboard  │────▶│  /api/analyze       │────▶│  GitHub REST API   │
│  (repo URL)  │     │  (Octokit + detect) │     │  (tree, package.json)
└──────────────┘     └─────────────────────┘     └────────────────────┘
        │
        ▼
┌──────────────┐     ┌─────────────────────┐     ┌────────────────────┐
│ /api/generate│────▶│  AIProvider         │────▶│ Mock (free) or     │
│  (streaming) │     │  (docs/prompts.ts)  │     │ OpenRouter (paid)  │
└──────────────┘     └─────────────────────┘     └────────────────────┘
        │
        ▼
┌──────────────┐     ┌─────────────────────┐
│  Doc Editor  │────▶│  /api/export        │
│(edit/preview)│     │  (md / html / docx) │
└──────────────┘     └─────────────────────┘
```

Repository analysis lives in [`src/lib/analysis`](./src/lib/analysis).
Document templates and prompts live in [`src/lib/docs`](./src/lib/docs). The
AI provider abstraction lives in [`src/lib/ai`](./src/lib/ai).

## Installation

```bash
git clone https://github.com/itsshreyasbhardwaj-design/smartdocs-ai.git
cd smartdocs-ai
pnpm install
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables
are required to try the full flow — paste any public GitHub repo URL on the
`/dashboard` page.

To enable LLM-polished output, copy `.env.example` to `.env.local` and set
`OPENROUTER_API_KEY` (see [openrouter.ai](https://openrouter.ai)).

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Run the Vitest suite |
| `pnpm test:watch` | Vitest in watch mode |

## Deployment

Deploy to [Vercel](https://vercel.com/new) — no configuration required for
the free local-generator mode. Set `OPENROUTER_API_KEY` (and optionally
`GITHUB_TOKEN` to raise the GitHub API rate limit) as environment variables
in your Vercel project settings to enable the paid/live paths.

## Roadmap

- [ ] Persist projects to Supabase instead of `localStorage` (multi-device)
- [ ] Clerk authentication + per-user project history
- [ ] Interactive dependency graph / architecture diagram visualizer
- [ ] PDF export
- [ ] Local folder / zip upload (in addition to GitHub URLs)
- [ ] AI Assistant actions per-section (shorten, expand, explain, translate)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
