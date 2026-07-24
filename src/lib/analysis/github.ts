import { Octokit } from "@octokit/rest";
import type { FileNode, RepoRef } from "./types";

export class RepoNotFoundError extends Error {
  constructor(ref: RepoRef) {
    super(`Repository ${ref.owner}/${ref.repo} was not found or is private.`);
    this.name = "RepoNotFoundError";
  }
}

/** Accepts a full GitHub URL, a shorthand "owner/repo", or "owner/repo#branch". */
export function parseGitHubUrl(input: string): Omit<RepoRef, "branch"> & { branch: string | null } {
  const trimmed = input.trim().replace(/\.git$/, "");

  let owner: string | undefined;
  let repo: string | undefined;
  let branch: string | null = null;

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://github.com/${trimmed}`);
    const parts = url.pathname.split("/").filter(Boolean);
    [owner, repo] = parts;
    if (parts[2] === "tree" && parts[3]) {
      branch = decodeURIComponent(parts[3]);
    } else if (url.hash) {
      branch = decodeURIComponent(url.hash.slice(1));
    }
  } catch {
    const [ownerRepo, hashBranch] = trimmed.split("#");
    [owner, repo] = ownerRepo.split("/");
    branch = hashBranch ?? null;
  }

  if (!owner || !repo) {
    throw new Error(`Could not parse a GitHub owner/repo from "${input}".`);
  }

  return { owner, repo, branch };
}

function getOctokit() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
  });
}

export interface FetchedRepo {
  ref: RepoRef;
  description: string | null;
  language: string | null;
  license: string | null;
  tree: FileNode[];
  getFile: (path: string) => Promise<string | null>;
}

export async function fetchRepo(ownerRepo: Omit<RepoRef, "branch"> & { branch: string | null }): Promise<FetchedRepo> {
  const octokit = getOctokit();
  const { owner, repo } = ownerRepo;

  let repoData;
  try {
    const res = await octokit.repos.get({ owner, repo });
    repoData = res.data;
  } catch {
    throw new RepoNotFoundError({ owner, repo, branch: ownerRepo.branch ?? "main" });
  }

  const branch = ownerRepo.branch ?? repoData.default_branch;

  const { data: branchData } = await octokit.repos.getBranch({ owner, repo, branch });
  const treeSha = branchData.commit.commit.tree.sha;

  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: "true",
  });

  const tree: FileNode[] = treeData.tree
    .filter((entry) => entry.path && entry.type)
    .map((entry) => ({
      path: entry.path as string,
      type: entry.type === "tree" ? "dir" : "file",
      size: entry.size,
    }));

  const fileCache = new Map<string, string | null>();

  const getFile = async (path: string): Promise<string | null> => {
    if (fileCache.has(path)) return fileCache.get(path)!;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
      if (Array.isArray(data) || data.type !== "file" || !("content" in data)) {
        fileCache.set(path, null);
        return null;
      }
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      fileCache.set(path, content);
      return content;
    } catch {
      fileCache.set(path, null);
      return null;
    }
  };

  return {
    ref: { owner, repo, branch },
    description: repoData.description,
    language: repoData.language,
    license: repoData.license?.spdx_id ?? null,
    tree,
    getFile,
  };
}
