"use client";

import { GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/project-store";

export function AnalysisSummary() {
  const analysis = useProjectStore((s) => s.currentAnalysis);
  if (!analysis) return null;

  const tags = [
    analysis.language,
    analysis.framework,
    analysis.packageManager,
    ...analysis.databases,
    ...analysis.testingFrameworks,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3">
      <a
        href={analysis.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-sm font-medium text-white hover:underline"
      >
        <GitFork className="h-4 w-4" />
        {analysis.ref.owner}/{analysis.ref.repo}
      </a>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
