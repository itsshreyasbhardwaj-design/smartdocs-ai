"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Code2, Download, Eye, FileDown, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docTypeMeta } from "@/lib/docs/types";
import { useProjectStore } from "@/store/project-store";
import { exportMarkdown, exportViaApi } from "@/lib/export";
import { cn } from "@/lib/utils";

export function DocEditor() {
  const { activeDocType, currentDocs, docStatus, setDocContent, currentAnalysis, saveCurrentProject } =
    useProjectStore();
  const [view, setView] = useState<"edit" | "preview">("preview");
  const [exporting, setExporting] = useState<string | null>(null);

  const meta = docTypeMeta(activeDocType);
  const content = currentDocs[activeDocType] ?? "";
  const status = docStatus[activeDocType] ?? "idle";
  const repoName = currentAnalysis ? `${currentAnalysis.ref.owner}-${currentAnalysis.ref.repo}` : "smartdocs";
  const filename = `${repoName}-${meta.id}`;

  async function handleExport(format: "md" | "html" | "docx") {
    if (!content) return;
    setExporting(format);
    try {
      if (format === "md") exportMarkdown(content, filename);
      else await exportViaApi(content, filename, format);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <div>
          <h2 className="font-medium text-white">{meta.title}</h2>
          <p className="text-xs text-zinc-500">{meta.filename}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setView("edit")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs",
                view === "edit" ? "bg-white/10 text-white" : "text-zinc-400"
              )}
            >
              <Code2 className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => setView("preview")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs",
                view === "preview" ? "bg-white/10 text-white" : "text-zinc-400"
              )}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleExport("md")} disabled={!content}>
            {exporting === "md" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
            .md
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("html")} disabled={!content}>
            {exporting === "html" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
            .html
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("docx")} disabled={!content}>
            {exporting === "docx" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            .docx
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {status === "idle" && !content && (
          <p className="text-sm text-zinc-500">This document hasn&apos;t been generated yet.</p>
        )}
        {status === "generating" && !content && (
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating…
          </p>
        )}
        {view === "edit" ? (
          <textarea
            value={content}
            onChange={(e) => {
              setDocContent(activeDocType, e.target.value);
            }}
            onBlur={() => saveCurrentProject()}
            spellCheck={false}
            className="h-full min-h-[60vh] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
        ) : (
          <article className="prose-invert-smartdocs prose prose-sm max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "_Nothing generated yet._"}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
