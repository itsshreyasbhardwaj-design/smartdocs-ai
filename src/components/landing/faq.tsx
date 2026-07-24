const FAQS = [
  {
    q: "Does this require an OpenAI or OpenRouter API key?",
    a: "No. SmartDocs ships with a built-in local generator that produces real, grounded documentation from the repo analysis — no key, no cost. Add an OPENROUTER_API_KEY later if you want LLM-polished prose.",
  },
  {
    q: "What repositories can I analyze?",
    a: "Any public GitHub repository. Paste a full URL, an owner/repo shorthand, or a URL with a specific branch.",
  },
  {
    q: "Can I edit the generated docs before exporting?",
    a: "Yes — every document opens in a full markdown editor with live preview before you export or commit it.",
  },
  {
    q: "What formats can I export to?",
    a: "Markdown, HTML, and DOCX today. PDF export is on the roadmap.",
  },
  {
    q: "Is my data stored anywhere?",
    a: "The core app runs entirely client + serverless — generated projects are saved to your browser's local storage. No account or database is required to use it.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mt-12 divide-y divide-white/10">
        {FAQS.map((item) => (
          <div key={item.q} className="py-6">
            <h3 className="font-medium text-white">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
