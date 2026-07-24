import { describe, expect, it } from "vitest";
import { generateTemplate } from "./templates";
import { DOC_TYPES } from "./types";
import { fixtureAnalysis } from "./test-fixtures";

describe("generateTemplate", () => {
  it("produces non-empty markdown for every doc type", () => {
    for (const doc of DOC_TYPES) {
      const markdown = generateTemplate(doc.id, fixtureAnalysis);
      expect(markdown.length).toBeGreaterThan(20);
    }
  });

  it("grounds the README in real analysis facts", () => {
    const markdown = generateTemplate("readme", fixtureAnalysis);
    expect(markdown).toContain("acme/widgets".split("/")[1]); // repo name in title
    expect(markdown).toContain("pnpm install");
    expect(markdown).toContain("Next.js");
    expect(markdown).toContain("DATABASE_URL");
  });

  it("flags missing database info instead of inventing it", () => {
    const noDb = { ...fixtureAnalysis, databases: [] };
    const markdown = generateTemplate("database", noDb);
    expect(markdown).toContain("No database or ORM dependency was detected");
  });

  it("uses the detected package manager in the installation guide", () => {
    const markdown = generateTemplate("installation", fixtureAnalysis);
    expect(markdown).toContain("pnpm install");
  });
});
