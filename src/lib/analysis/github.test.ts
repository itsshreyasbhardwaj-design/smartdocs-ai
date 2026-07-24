import { describe, expect, it } from "vitest";
import { parseGitHubUrl } from "./github";

describe("parseGitHubUrl", () => {
  it("parses a full https URL", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
      branch: null,
    });
  });

  it("parses a shorthand owner/repo", () => {
    expect(parseGitHubUrl("vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
      branch: null,
    });
  });

  it("parses an owner/repo#branch shorthand", () => {
    expect(parseGitHubUrl("vercel/next.js#canary")).toEqual({
      owner: "vercel",
      repo: "next.js",
      branch: "canary",
    });
  });

  it("parses a tree URL with a branch", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js/tree/canary")).toEqual({
      owner: "vercel",
      repo: "next.js",
      branch: "canary",
    });
  });

  it("strips a trailing .git suffix", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js.git")).toEqual({
      owner: "vercel",
      repo: "next.js",
      branch: null,
    });
  });

  it("throws when no owner/repo can be parsed", () => {
    expect(() => parseGitHubUrl("not-a-repo")).toThrow();
  });
});
