"use client";

import { FolderGit2, Plus, Trash2 } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { cn } from "@/lib/utils";

export function HistorySidebar() {
  const { projects, activeProjectId, loadProject, deleteProject, resetCurrent } = useProjectStore();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <button
        onClick={resetCurrent}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm text-zinc-300 hover:border-violet-500/40 hover:text-white"
      >
        <Plus className="h-4 w-4" /> New project
      </button>

      <div className="flex-1 overflow-auto">
        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
          History
        </p>
        {projects.length === 0 && (
          <p className="px-1 text-xs text-zinc-600">Generated projects will appear here.</p>
        )}
        <div className="space-y-1">
          {projects.map((p) => (
            <div
              key={p.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm",
                activeProjectId === p.id ? "bg-violet-500/15 text-white" : "text-zinc-400 hover:bg-white/5"
              )}
            >
              <button onClick={() => loadProject(p.id)} className="flex flex-1 items-center gap-2 truncate text-left">
                <FolderGit2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {p.analysis.ref.owner}/{p.analysis.ref.repo}
                </span>
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="hidden shrink-0 text-zinc-500 hover:text-red-400 group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
