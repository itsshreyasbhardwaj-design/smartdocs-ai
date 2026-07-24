import { DOC_TYPES } from "@/lib/docs/types";
import { Badge } from "@/components/ui/badge";

export function DocTypesGrid() {
  return (
    <section id="demo" className="mx-auto max-w-7xl px-6 py-12">
      <Card />
    </section>
  );
}

function Card() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-white">Generated in a single pass</h3>
        <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-300">15 document types</Badge>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DOC_TYPES.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-300"
          >
            {doc.title}
          </div>
        ))}
      </div>
    </div>
  );
}
