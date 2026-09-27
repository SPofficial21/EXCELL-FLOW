import { Building2, Calculator, ShoppingCart } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

const USE_CASES = [
  {
    icon: ShoppingCart,
    audience: "E-commerce",
    copy: "Clean product catalogs, fix SKUs and prices before every upload.",
  },
  {
    icon: Building2,
    audience: "Agencies",
    copy: "Turn client exports into report-ready sheets in one click.",
  },
  {
    icon: Calculator,
    audience: "Accountants",
    copy: "Normalize dates and currencies across financial statements.",
  },
];

export function UseCases() {
  return (
    <section className="scene-3d mx-auto max-w-6xl px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for your workflow</h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {USE_CASES.map((useCase, index) => (
          <Reveal key={useCase.audience} delay={index * 0.1}>
            <TiltCard className="h-full">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <useCase.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{useCase.audience}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{useCase.copy}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
