import { Braces, CalendarClock, Copy, Layers, Sparkles } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

const FEATURES = [
  {
    icon: Copy,
    title: "Duplicate remover",
    copy: "Finds near-identical rows, not just exact matches.",
  },
  {
    icon: CalendarClock,
    title: "Smart formatting",
    copy: "Dates, currencies and phone numbers normalized in one pass.",
  },
  {
    icon: Layers,
    title: "Column auto-fix",
    copy: "Headers detected, blank columns dropped, types aligned.",
  },
  {
    icon: Braces,
    title: "Custom AI instructions",
    copy: "Ask in plain English: \"split full names\", \"trim SKUs\".",
  },
  {
    icon: Sparkles,
    title: "Bulk processing",
    copy: "Queue dozens of files and download them as one archive.",
  },
];

export function Features() {
  return (
    <section id="features" className="scene-3d relative border-y border-border/60 bg-secondary/30 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything messy data throws at you
          </h2>
          <p className="mt-4 text-muted-foreground">
            One engine that replaces an afternoon of find-and-replace.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <TiltCard className="h-full" intensity={9}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.copy}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
