"use client";

import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { DOC_TYPES } from "@/lib/docs/types";
import { useProjectStore } from "@/store/project-store";
import { cn } from "@/lib/utils";

export function DocList() {
  const { activeDocType, setActiveDocType, docStatus } = useProjectStore();

  return (
    <nav className="flex flex-col gap-1">
      {DOC_TYPES.map((doc) => {
        const status = docStatus[doc.id] ?? "idle";
        return (
          <button
            key={doc.id}
            onClick={() => setActiveDocType(doc.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              activeDocType === doc.id
                ? "bg-violet-500/15 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <StatusIcon status={status} />
            <span className="truncate">{doc.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "generating") return <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-violet-400" />;
  if (status === "done") return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />;
  if (status === "error") return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />;
  return <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600" />;
}
