import { Download, Upload, Wand2 } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

const STEPS = [
  {
    icon: Upload,
    title: "Upload your file",
    copy: "Drag and drop any CSV or Excel file. We validate it before anything else happens.",
  },
  {
    icon: Wand2,
    title: "AI cleans & organizes",
    copy: "Duplicates disappear, formats snap into place, and your custom instructions are applied.",
  },
  {
    icon: Download,
    title: "Download ready-to-use",
    copy: "Preview the result, then export a clean spreadsheet your team can work with today.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scene-3d relative mx-auto max-w-6xl px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three steps. That's it.</h2>
        <p className="mt-4 text-muted-foreground">
          No formulas, no macros, no data team. ExcelFlow AI handles the boring part.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.12}>
            <TiltCard className="h-full">
              <span className="text-xs font-semibold text-muted-foreground">
                Step {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.copy}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
