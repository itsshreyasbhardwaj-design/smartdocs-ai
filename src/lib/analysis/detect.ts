import type { DetectedDependency, FileNode } from "./types";

export interface PackageJsonShape {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

const FRAMEWORK_SIGNATURES: Array<{ name: string; deps: string[] }> = [
  { name: "Next.js", deps: ["next"] },
  { name: "Nuxt", deps: ["nuxt"] },
  { name: "SvelteKit", deps: ["@sveltejs/kit"] },
  { name: "Remix", deps: ["@remix-run/react"] },
  { name: "Astro", deps: ["astro"] },
  { name: "Vite + React", deps: ["vite", "react"] },
  { name: "Vue", deps: ["vue"] },
  { name: "Angular", deps: ["@angular/core"] },
  { name: "React", deps: ["react", "react-dom"] },
  { name: "Express", deps: ["express"] },
  { name: "Fastify", deps: ["fastify"] },
  { name: "NestJS", deps: ["@nestjs/core"] },
  { name: "Django", deps: [] },
  { name: "Flask", deps: [] },
  { name: "FastAPI", deps: [] },
];

const TESTING_SIGNATURES: Array<{ name: string; deps: string[] }> = [
  { name: "Vitest", deps: ["vitest"] },
  { name: "Jest", deps: ["jest"] },
  { name: "Playwright", deps: ["@playwright/test", "playwright"] },
  { name: "Cypress", deps: ["cypress"] },
  { name: "Mocha", deps: ["mocha"] },
  { name: "pytest", deps: [] },
];

const DATABASE_SIGNATURES: Array<{ name: string; deps: string[] }> = [
  { name: "Prisma", deps: ["@prisma/client", "prisma"] },
  { name: "Drizzle ORM", deps: ["drizzle-orm"] },
  { name: "Supabase", deps: ["@supabase/supabase-js"] },
  { name: "Mongoose (MongoDB)", deps: ["mongoose"] },
  { name: "TypeORM", deps: ["typeorm"] },
  { name: "Sequelize", deps: ["sequelize"] },
  { name: "SQLAlchemy", deps: [] },
];

function matchesDeps(deps: Set<string>, signatures: Array<{ name: string; deps: string[] }>): string[] {
  const matches: string[] = [];
  for (const sig of signatures) {
    if (sig.deps.length > 0 && sig.deps.every((d) => deps.has(d))) {
      matches.push(sig.name);
    } else if (sig.deps.length > 0 && sig.deps.some((d) => deps.has(d)) && sig.deps.length === 1) {
      matches.push(sig.name);
    }
  }
  return matches;
}

export function detectFramework(deps: Set<string>): string | null {
  for (const sig of FRAMEWORK_SIGNATURES) {
    if (sig.deps.length > 0 && sig.deps.every((d) => deps.has(d))) {
      return sig.name;
    }
  }
  return null;
}

export function detectTestingFrameworks(deps: Set<string>, tree: FileNode[]): string[] {
  const found = new Set(matchesDeps(deps, TESTING_SIGNATURES));
  if (tree.some((f) => /(^|\/)tests?(\/|$)/.test(f.path) && f.path.endsWith(".py"))) {
    found.add("pytest");
  }
  return [...found];
}

export function detectDatabases(deps: Set<string>, tree: FileNode[]): string[] {
  const found = new Set(matchesDeps(deps, DATABASE_SIGNATURES));
  if (tree.some((f) => f.path.endsWith("schema.prisma"))) found.add("Prisma");
  if (tree.some((f) => /requirements.*\.txt$/.test(f.path))) {
    // best-effort: python projects with an ORM are flagged via requirements content elsewhere
  }
  return [...found];
}

export function detectPackageManager(tree: FileNode[]): string | null {
  const paths = new Set(tree.map((f) => f.path));
  if (paths.has("pnpm-lock.yaml")) return "pnpm";
  if (paths.has("bun.lockb") || paths.has("bun.lock")) return "bun";
  if (paths.has("yarn.lock")) return "yarn";
  if (paths.has("package-lock.json")) return "npm";
  if (paths.has("poetry.lock")) return "poetry";
  if (paths.has("Pipfile.lock")) return "pipenv";
  if (paths.has("requirements.txt")) return "pip";
  if (paths.has("Cargo.lock")) return "cargo";
  if (paths.has("go.sum")) return "go modules";
  return null;
}

export function detectCiProviders(tree: FileNode[]): string[] {
  const found = new Set<string>();
  if (tree.some((f) => f.path.startsWith(".github/workflows/"))) found.add("GitHub Actions");
  if (tree.some((f) => f.path === ".gitlab-ci.yml")) found.add("GitLab CI");
  if (tree.some((f) => f.path === ".circleci/config.yml")) found.add("CircleCI");
  if (tree.some((f) => f.path === "azure-pipelines.yml")) found.add("Azure Pipelines");
  if (tree.some((f) => f.path === ".travis.yml")) found.add("Travis CI");
  return [...found];
}

export function detectDeploymentTargets(tree: FileNode[], deps: Set<string>): string[] {
  const found = new Set<string>();
  const paths = new Set(tree.map((f) => f.path));
  if (paths.has("vercel.json") || deps.has("vercel")) found.add("Vercel");
  if (paths.has("netlify.toml")) found.add("Netlify");
  if (paths.has("fly.toml")) found.add("Fly.io");
  if (paths.has("render.yaml")) found.add("Render");
  if (paths.has("Procfile")) found.add("Heroku");
  if (tree.some((f) => f.path === "Dockerfile")) found.add("Docker");
  if (tree.some((f) => f.path.startsWith(".github/workflows/") )) {
    // deployment via CI is common but not conclusive; left to workflow content inspection if needed
  }
  return [...found];
}

export function detectLanguages(tree: FileNode[]): string[] {
  const ext: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    py: "Python",
    go: "Go",
    rs: "Rust",
    rb: "Ruby",
    java: "Java",
    kt: "Kotlin",
    php: "PHP",
    cs: "C#",
    swift: "Swift",
  };
  const counts = new Map<string, number>();
  for (const f of tree) {
    if (f.type !== "file") continue;
    const extension = f.path.split(".").pop() ?? "";
    const lang = ext[extension];
    if (lang) counts.set(lang, (counts.get(lang) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([lang]) => lang);
}

export function extractDependencies(pkg: PackageJsonShape | null): {
  set: Set<string>;
  list: DetectedDependency[];
} {
  const set = new Set<string>();
  const list: DetectedDependency[] = [];
  if (!pkg) return { set, list };
  for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
    set.add(name);
    list.push({ name, version, dev: false });
  }
  for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
    set.add(name);
    list.push({ name, version, dev: true });
  }
  return { set, list };
}

export function buildFolderTree(tree: FileNode[], maxDepth = 3, maxEntries = 120): string {
  const relevant = tree
    .filter((f) => !f.path.includes("node_modules") && !f.path.startsWith("."))
    .filter((f) => f.path.split("/").length <= maxDepth)
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, maxEntries);

  const lines: string[] = [];
  for (const node of relevant) {
    const depth = node.path.split("/").length - 1;
    const name = node.path.split("/").pop();
    const prefix = "  ".repeat(depth) + (depth > 0 ? "└─ " : "");
    lines.push(`${prefix}${name}${node.type === "dir" ? "/" : ""}`);
  }
  return lines.join("\n");
}

export function extractEnvVars(envExampleContent: string | null): string[] {
  if (!envExampleContent) return [];
  return envExampleContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => line.split("=")[0].trim())
    .filter(Boolean);
}
