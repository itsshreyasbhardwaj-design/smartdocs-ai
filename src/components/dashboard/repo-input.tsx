"use client";

import { useState } from "react";
import { ArrowRight, GitFork, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { DOC_TYPES } from "@/lib/docs/types";

const EXAMPLES = ["vercel/next.js", "shadcn-ui/ui", "vitejs/vite"];

export function RepoInput() {
  const [value, setValue] = useState("");
  const {
    isAnalyzing,
    analyzeError,
    startAnalysis,
    setAnalysis,
    setAnalyzeError,
    setRepoUrl,
    setDocStatus,
    appendDocContent,
    setActiveDocType,
    saveCurrentProject,
  } = useProjectStore();

  async function handleSubmit(repoUrl: string) {
    if (!repoUrl.trim() || isAnalyzing) return;
    setRepoUrl(repoUrl);
    startAnalysis();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAnalyzeError(data.error ?? "Failed to analyze repository.");
        return;
      }
      setAnalysis(data.analysis);
      setActiveDocType("readme");

      // Kick off generation for every doc type, with a small concurrency cap.
      const queue = [...DOC_TYPES];
      const CONCURRENCY = 3;

      async function worker() {
        while (queue.length > 0) {
          const doc = queue.shift();
          if (!doc) return;
          setDocStatus(doc.id, "generating");
          try {
            const genRes = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ docType: doc.id, analysis: data.analysis }),
            });
            if (!genRes.ok || !genRes.body) throw new Error(await genRes.text());
            const reader = genRes.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value: chunk } = await reader.read();
              if (done) break;
              appendDocContent(doc.id, decoder.decode(chunk, { stream: true }));
            }
            setDocStatus(doc.id, "done");
          } catch {
            setDocStatus(doc.id, "error");
          }
        }
      }

      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
      saveCurrentProject();
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(value);
          }}
          className="flex items-center gap-2"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-black/30 px-4 py-3">
            <GitFork className="h-4 w-4 shrink-0 text-zinc-500" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="github.com/owner/repo"
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              disabled={isAnalyzing}
            />
          </div>
          <Button type="submit" disabled={isAnalyzing || !value.trim()}>
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {isAnalyzing ? "Analyzing…" : "Generate"}
          </Button>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setValue(ex);
              handleSubmit(ex);
            }}
            className="rounded-full border border-white/10 px-2.5 py-1 hover:border-violet-500/40 hover:text-white"
          >
            {ex}
          </button>
        ))}
      </div>

      {analyzeError && (
        <p className="mt-4 text-center text-sm text-red-400">{analyzeError}</p>
      )}
    </div>
  );
}
