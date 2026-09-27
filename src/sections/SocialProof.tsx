import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

const STATS = [
  { value: "1M+", label: "rows cleaned" },
  { value: "10,000+", label: "businesses" },
  { value: "5.2 hrs", label: "saved per dataset" },
  { value: "99.4%", label: "formatting accuracy" },
];

const TESTIMONIALS = [
  {
    quote:
      "Our weekly supplier export used to take two people an afternoon. Now it's one upload and a coffee.",
    name: "Priya N.",
    role: "Ops lead, e-commerce",
  },
  {
    quote:
      "Client spreadsheets arrive in five different date formats. ExcelFlow normalizes all of them before I open them.",
    name: "Marcus L.",
    role: "Agency founder",
  },
  {
    quote: "Reconciliation is finally boring again. That's the highest compliment I can give a tool.",
    name: "Dana K.",
    role: "Accountant",
  },
];

export function SocialProof() {
  return (
    <section className="scene-3d mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            style={{ transformPerspective: 1000 }}
            className="glass-panel p-6 text-center"
          >
            <p className="gradient-text text-3xl font-extrabold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial, index) => (
          <Reveal key={testimonial.name} delay={index * 0.1}>
            <TiltCard className="h-full" intensity={8}>
              <Quote className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm leading-relaxed">{testimonial.quote}</p>
              <p className="mt-5 text-sm font-semibold">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
