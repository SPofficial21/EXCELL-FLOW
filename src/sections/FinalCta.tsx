import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-secondary/40 py-24">
      <div aria-hidden className="grid-backdrop absolute inset-0" />
      <Reveal className="relative mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Stop wasting hours on Excel. <span className="gradient-text">Let AI handle it.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Free to start. No credit card. Your first clean file is 30 seconds away.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <a href="#upload">
            Start free
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </Reveal>
    </section>
  );
}
