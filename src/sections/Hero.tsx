import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";

const HeroScene = lazy(() =>
  import("@/components/three/HeroScene").then((mod) => ({ default: mod.HeroScene })),
);

const BADGES = [
  { icon: ShieldCheck, label: "Used by 10,000+ businesses" },
  { icon: Timer, label: "Save 5+ hours per dataset" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36">
      <div aria-hidden className="grid-backdrop absolute inset-0" />
      <Suspense fallback={null}>
        <HeroScene className="pointer-events-none absolute inset-x-0 top-10 h-[620px] opacity-60 dark:opacity-90" />
      </Suspense>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_38%,hsl(var(--background)/0.88),transparent_70%)] dark:bg-[radial-gradient(60%_45%_at_50%_38%,hsl(var(--background)/0.62),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          AI-powered data cleaning engine
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 36, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200 }}
          className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl"
        >
          Clean your Excel data in seconds — <span className="gradient-text">no manual work</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Upload a messy spreadsheet and ExcelFlow AI removes duplicates, fixes dates and currencies,
          splits columns, and hands back a file you can use right away.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <a href="#upload">
              Upload your file
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#before-after">
              <PlayCircle className="h-4 w-4" />
              Try demo
            </a>
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          {BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-accent" />
              {label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
