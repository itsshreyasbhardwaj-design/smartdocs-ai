import type { RepoAnalysis } from "@/lib/analysis";

export const fixtureAnalysis: RepoAnalysis = {
  ref: { owner: "acme", repo: "widgets", branch: "main" },
  url: "https://github.com/acme/widgets",
  description: "A widget factory.",
  defaultBranch: "main",
  language: "TypeScript",
  languages: ["TypeScript", "JavaScript"],
  framework: "Next.js",
  packageManager: "pnpm",
  testingFrameworks: ["Vitest"],
  ciProviders: ["GitHub Actions"],
  deploymentTargets: ["Vercel"],
  databases: ["Prisma"],
  keyLibraries: [
    { name: "next", version: "16.0.0", dev: false },
    { name: "react", version: "19.0.0", dev: false },
  ],
  hasDocker: false,
  hasTypeScript: true,
  license: "MIT",
  scripts: { dev: "next dev", build: "next build", test: "vitest run" },
  envVars: ["DATABASE_URL", "NEXTAUTH_SECRET"],
  folderTree: "src/\n  app/\n  lib/",
  topLevelDirs: ["src", "public"],
  fileCount: 42,
  readmeExcerpt: null,
};
