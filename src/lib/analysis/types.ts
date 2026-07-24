export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export interface DetectedDependency {
  name: string;
  version: string;
  dev: boolean;
}

export interface FileNode {
  path: string;
  type: "file" | "dir";
  size?: number;
}

export interface RepoAnalysis {
  ref: RepoRef;
  url: string;
  description: string | null;
  defaultBranch: string;
  language: string | null;
  languages: string[];
  framework: string | null;
  packageManager: string | null;
  testingFrameworks: string[];
  ciProviders: string[];
  deploymentTargets: string[];
  databases: string[];
  keyLibraries: DetectedDependency[];
  hasDocker: boolean;
  hasTypeScript: boolean;
  license: string | null;
  scripts: Record<string, string>;
  envVars: string[];
  folderTree: string;
  topLevelDirs: string[];
  fileCount: number;
  readmeExcerpt: string | null;
}
