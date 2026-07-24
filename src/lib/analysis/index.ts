import { fetchRepo, parseGitHubUrl } from "./github";
import {
  buildFolderTree,
  detectCiProviders,
  detectDatabases,
  detectDeploymentTargets,
  detectFramework,
  detectLanguages,
  detectPackageManager,
  detectTestingFrameworks,
  extractDependencies,
  extractEnvVars,
  type PackageJsonShape,
} from "./detect";
import type { RepoAnalysis } from "./types";

export * from "./types";
export { parseGitHubUrl, RepoNotFoundError } from "./github";

export async function analyzeRepository(input: string): Promise<RepoAnalysis> {
  const parsed = parseGitHubUrl(input);
  const fetched = await fetchRepo(parsed);
  const { ref, description, license, tree } = fetched;

  let pkg: PackageJsonShape | null = null;
  const pkgRaw = await fetched.getFile("package.json");
  if (pkgRaw) {
    try {
      pkg = JSON.parse(pkgRaw);
    } catch {
      pkg = null;
    }
  }

  const { set: depSet, list: keyLibraries } = extractDependencies(pkg);

  const envExample =
    (await fetched.getFile(".env.example")) ?? (await fetched.getFile(".env.sample"));

  const readme =
    (await fetched.getFile("README.md")) ?? (await fetched.getFile("readme.md"));

  const topLevelDirs = [...new Set(
    tree
      .filter((f) => f.type === "dir" && !f.path.includes("/") && !f.path.startsWith("."))
      .map((f) => f.path)
  )].sort();

  const analysis: RepoAnalysis = {
    ref,
    url: `https://github.com/${ref.owner}/${ref.repo}`,
    description,
    defaultBranch: ref.branch,
    language: fetched.language,
    languages: detectLanguages(tree),
    framework: detectFramework(depSet),
    packageManager: detectPackageManager(tree),
    testingFrameworks: detectTestingFrameworks(depSet, tree),
    ciProviders: detectCiProviders(tree),
    deploymentTargets: detectDeploymentTargets(tree, depSet),
    databases: detectDatabases(depSet, tree),
    keyLibraries: keyLibraries
      .filter((d) => !d.dev)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 25),
    hasDocker: tree.some((f) => f.path === "Dockerfile"),
    hasTypeScript: tree.some((f) => f.path === "tsconfig.json") || depSet.has("typescript"),
    license,
    scripts: pkg?.scripts ?? {},
    envVars: extractEnvVars(envExample),
    folderTree: buildFolderTree(tree),
    topLevelDirs,
    fileCount: tree.filter((f) => f.type === "file").length,
    readmeExcerpt: readme ? readme.slice(0, 1500) : null,
  };

  return analysis;
}
