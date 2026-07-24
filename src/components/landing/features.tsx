import {
  BookOpenText,
  GitBranch,
  LayoutGrid,
  Rocket,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Deep repository analysis",
    description:
      "Detects your framework, language, package manager, testing setup, database, and CI/CD — no config required.",
  },
  {
    icon: BookOpenText,
    title: "15 document types",
    description:
      "README, API docs, architecture, folder structure, onboarding, deployment, FAQ, changelog, and more — generated together.",
  },
  {
    icon: Sparkles,
    title: "AI-polished, fact-grounded",
    description:
      "Runs great with zero setup on the built-in local generator, or plug in OpenRouter for LLM-polished prose that never contradicts your repo.",
  },
  {
    icon: LayoutGrid,
    title: "Full markdown editor",
    description:
      "Every generated doc is instantly editable with live preview before you export or commit it.",
  },
  {
    icon: GitBranch,
    title: "Architecture visualizer",
    description:
      "Auto-generated folder trees and dependency summaries so new contributors understand the system in minutes.",
  },
  {
    icon: Rocket,
    title: "Export anywhere",
    description:
      "Markdown, HTML, or DOCX — drop straight into your repo, wiki, or Notion.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Everything a great docs site needs
        </h2>
        <p className="mt-4 text-zinc-400">
          One pass over your repository produces a full, coherent documentation suite —
          not fifteen disconnected files.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="group transition-colors hover:border-violet-500/40">
            <CardContent className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-white">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
