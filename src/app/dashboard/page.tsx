"use client";

import Link from "next/link";
import { FileStack } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { RepoInput } from "@/components/dashboard/repo-input";
import { HistorySidebar } from "@/components/dashboard/history-sidebar";
import { DocList } from "@/components/dashboard/doc-list";
import { DocEditor } from "@/components/dashboard/doc-editor";
import { AnalysisSummary } from "@/components/dashboard/analysis-summary";

export default function DashboardPage() {
  const currentAnalysis = useProjectStore((s) => s.currentAnalysis);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <FileStack className="h-3.5 w-3.5 text-white" />
          </span>
          SmartDocs
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 md:block">
          <HistorySidebar />
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          {!currentAnalysis ? (
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="w-full">
                <h1 className="mb-8 text-center text-2xl font-semibold text-white">
                  Paste a GitHub repository to generate its docs
                </h1>
                <RepoInput />
              </div>
            </div>
          ) : (
            <>
              <AnalysisSummary />
              <div className="flex flex-1 overflow-hidden">
                <div className="w-56 shrink-0 overflow-auto border-r border-white/10 p-3">
                  <DocList />
                </div>
                <div className="flex-1 overflow-hidden">
                  <DocEditor />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
