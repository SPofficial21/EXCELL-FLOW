import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Try the engine on small files.",
    perks: ["3 files per month", "Up to 1,000 rows", "Duplicate removal", "CSV export"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    blurb: "Cheaper than one hour of manual cleanup.",
    perks: [
      "Unlimited files",
      "Up to 500,000 rows",
      "Custom AI instructions",
      "Bulk processing & history",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scene-3d border-y border-border/60 bg-secondary/30 py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing that pays for itself</h2>
          <p className="mt-4 text-muted-foreground">
            A data entry assistant costs $2,000+ a month. ExcelFlow AI costs less than a lunch.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.12}>
              <TiltCard
                className={cn("h-full", plan.featured && "border-primary/50 ring-1 ring-primary/30")}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-sm font-semibold text-muted-foreground">{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{plan.blurb}</p>

                <ul className="mt-6 space-y-3 text-sm">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-8 w-full"
                  variant={plan.featured ? "default" : "outline"}
                  asChild
                >
                  <a href="#upload">{plan.cta}</a>
                </Button>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
