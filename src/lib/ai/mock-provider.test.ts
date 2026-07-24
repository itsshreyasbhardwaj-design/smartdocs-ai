import { describe, expect, it } from "vitest";
import { MockProvider } from "./mock-provider";
import { generateTemplate } from "@/lib/docs/templates";
import { fixtureAnalysis } from "@/lib/docs/test-fixtures";

describe("MockProvider", () => {
  it("is not marked as a live/paid provider", () => {
    expect(new MockProvider().isLive).toBe(false);
  });

  it("streams the deterministic template for a doc type + analysis context", async () => {
    const provider = new MockProvider();
    let output = "";
    for await (const chunk of provider.generateStream({
      messages: [{ role: "user", content: "ignored" }],
      context: { docType: "readme", analysis: fixtureAnalysis },
    })) {
      output += chunk;
    }
    expect(output).toBe(generateTemplate("readme", fixtureAnalysis));
  });

  it("falls back to echoing the last message when no analysis context is given", async () => {
    const provider = new MockProvider();
    let output = "";
    for await (const chunk of provider.generateStream({
      messages: [{ role: "user", content: "hello world" }],
    })) {
      output += chunk;
    }
    expect(output).toBe("hello world");
  });
});
