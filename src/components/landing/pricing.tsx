import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Open Source",
    price: "$0",
    description: "Self-host it. Runs fully on the local generator — no API key, no bill, ever.",
    features: [
      "Unlimited repositories",
      "All 15 document types",
      "Markdown / HTML / DOCX export",
      "MIT licensed, full source",
    ],
    cta: "Clone the repo",
    href: "https://github.com/itsshreyasbhardwaj-design/smartdocs-ai",
    highlighted: false,
  },
  {
    name: "Pro (bring your own key)",
    price: "$0 + usage",
    description: "Plug in an OpenRouter key for LLM-polished prose. You pay OpenRouter directly, at cost.",
    features: [
      "Everything in Open Source",
      "AI-polished writing via any OpenRouter model",
      "Streaming generation",
      "Priority template updates",
    ],
    cta: "Open dashboard",
    href: "/dashboard",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Honest pricing
        </h2>
        <p className="mt-4 text-zinc-400">
          SmartDocs is open source. There is no subscription — you either self-host for free
          or bring your own model key.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(plan.highlighted && "border-violet-500/40 bg-violet-500/[0.04]")}
          >
            <CardContent className="flex h-full flex-col gap-6">
              <div>
                <h3 className="font-medium text-white">{plan.name}</h3>
                <div className="mt-2 text-3xl font-semibold text-white">{plan.price}</div>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              </div>
              <ul className="flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={plan.highlighted ? "primary" : "outline"}>
                <a href={plan.href}>{plan.cta}</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
