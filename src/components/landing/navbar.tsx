import Link from "next/link";
import { FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08080b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <FileStack className="h-4 w-4 text-white" />
          </span>
          SmartDocs
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a
            href="https://github.com/itsshreyasbhardwaj-design/smartdocs-ai"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
        <Button asChild size="sm">
          <Link href="/dashboard">Open Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}
