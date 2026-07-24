"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitFork, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          Point it at a repo. Get a docs site back.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Documentation that
          <br />
          <span className="text-gradient">writes itself.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400"
        >
          SmartDocs analyzes any GitHub repository and generates a complete,
          editable documentation suite — README, architecture, API reference,
          onboarding guides, and twelve more — in minutes, not weekends.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg">
            <Link href="/dashboard">
              Generate your docs <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/itsshreyasbhardwaj-design/smartdocs-ai">
              <GitFork className="h-4 w-4" /> Star on GitHub
            </a>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 text-xs text-zinc-500"
        >
          Free and open source. Works instantly, no API key required.
        </motion.p>
      </div>
    </section>
  );
}
