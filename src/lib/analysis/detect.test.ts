import { describe, expect, it } from "vitest";
import {
  buildFolderTree,
  detectCiProviders,
  detectDeploymentTargets,
  detectFramework,
  detectPackageManager,
  detectTestingFrameworks,
  extractDependencies,
  extractEnvVars,
} from "./detect";
import type { FileNode } from "./types";

describe("detectFramework", () => {
  it("detects Next.js from dependency set", () => {
    expect(detectFramework(new Set(["next", "react", "react-dom"]))).toBe("Next.js");
  });

  it("detects Express when Next.js is absent", () => {
    expect(detectFramework(new Set(["express"]))).toBe("Express");
  });

  it("returns null when nothing matches", () => {
    expect(detectFramework(new Set(["lodash"]))).toBeNull();
  });
});

describe("detectPackageManager", () => {
  it("prefers pnpm lockfile", () => {
    const tree: FileNode[] = [{ path: "pnpm-lock.yaml", type: "file" }];
    expect(detectPackageManager(tree)).toBe("pnpm");
  });

  it("falls back to npm lockfile", () => {
    const tree: FileNode[] = [{ path: "package-lock.json", type: "file" }];
    expect(detectPackageManager(tree)).toBe("npm");
  });

  it("returns null when no manifest is found", () => {
    expect(detectPackageManager([])).toBeNull();
  });
});

describe("detectTestingFrameworks", () => {
  it("detects vitest from dependencies", () => {
    const found = detectTestingFrameworks(new Set(["vitest"]), []);
    expect(found).toContain("Vitest");
  });
});

describe("detectCiProviders", () => {
  it("detects GitHub Actions from workflow files", () => {
    const tree: FileNode[] = [{ path: ".github/workflows/ci.yml", type: "file" }];
    expect(detectCiProviders(tree)).toContain("GitHub Actions");
  });
});

describe("detectDeploymentTargets", () => {
  it("detects Vercel from vercel.json", () => {
    const tree: FileNode[] = [{ path: "vercel.json", type: "file" }];
    expect(detectDeploymentTargets(tree, new Set())).toContain("Vercel");
  });

  it("detects Docker from a Dockerfile", () => {
    const tree: FileNode[] = [{ path: "Dockerfile", type: "file" }];
    expect(detectDeploymentTargets(tree, new Set())).toContain("Docker");
  });
});

describe("extractDependencies", () => {
  it("splits dependencies and devDependencies", () => {
    const { set, list } = extractDependencies({
      dependencies: { next: "16.0.0" },
      devDependencies: { vitest: "4.0.0" },
    });
    expect(set.has("next")).toBe(true);
    expect(set.has("vitest")).toBe(true);
    expect(list.find((d) => d.name === "vitest")?.dev).toBe(true);
    expect(list.find((d) => d.name === "next")?.dev).toBe(false);
  });

  it("handles a null package.json", () => {
    const { set, list } = extractDependencies(null);
    expect(set.size).toBe(0);
    expect(list.length).toBe(0);
  });
});

describe("buildFolderTree", () => {
  it("excludes node_modules and dotfiles", () => {
    const tree: FileNode[] = [
      { path: "node_modules/react/index.js", type: "file" },
      { path: ".git/HEAD", type: "file" },
      { path: "src/index.ts", type: "file" },
    ];
    const rendered = buildFolderTree(tree);
    expect(rendered).toContain("index.ts");
    expect(rendered).not.toContain("node_modules");
  });
});

describe("extractEnvVars", () => {
  it("parses variable names from a .env.example file", () => {
    const content = "# comment\nAPI_KEY=changeme\nDATABASE_URL=postgres://\n";
    expect(extractEnvVars(content)).toEqual(["API_KEY", "DATABASE_URL"]);
  });

  it("returns an empty array when there is no file", () => {
    expect(extractEnvVars(null)).toEqual([]);
  });
});
