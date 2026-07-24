function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(markdown: string, filename: string) {
  download(new Blob([markdown], { type: "text/markdown;charset=utf-8" }), `${filename}.md`);
}

export async function exportViaApi(markdown: string, filename: string, format: "html" | "docx") {
  const res = await fetch("/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown, filename, format }),
  });
  if (!res.ok) throw new Error(`Export failed: ${await res.text()}`);
  const blob = await res.blob();
  download(blob, `${filename}.${format}`);
}
