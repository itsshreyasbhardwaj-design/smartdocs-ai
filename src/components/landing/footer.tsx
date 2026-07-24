import Link from "next/link";
import { FileStack } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <FileStack className="h-3.5 w-3.5 text-white" />
          </span>
          SmartDocs
        </Link>
        <p className="text-xs text-zinc-500">
          MIT licensed &middot; built in the open &middot;{" "}
          <a
            href="https://github.com/itsshreyasbhardwaj-design/smartdocs-ai"
            className="underline decoration-white/20 underline-offset-2 hover:text-zinc-300"
          >
            source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
