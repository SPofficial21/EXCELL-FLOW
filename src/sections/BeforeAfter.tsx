import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const MESSY = [
  ["  john SMITH ", "12/3/2023", "$1,200.00 usd"],
  ["Jane  doe", "2023-03-12", "1200"],
  ["JOHN Smith", "March 12 2023", "1.200,00"],
  ["", "n/a", "—"],
];

const CLEAN = [
  ["John Smith", "2023-03-12", "1200.00"],
  ["Jane Doe", "2023-03-12", "1200.00"],
  ["Ana Ruiz", "2023-04-02", "980.00"],
  ["Leo Park", "2023-04-08", "2450.00"],
];

function Sheet({
  title,
  rows,
  tone,
  rotate,
}: {
  title: string;
  rows: string[][];
  tone: "messy" | "clean";
  rotate: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: rotate * 2.5, y: 40 }}
      whileInView={{ opacity: 1, rotateY: rotate, y: 0 }}
      whileHover={{ rotateY: 0, scale: 1.02 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
      className="glass-panel w-full p-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            tone === "messy" ? "bg-destructive/15 text-destructive" : "bg-accent/15 text-accent",
          )}
        >
          {tone === "messy" ? "12 issues" : "0 issues"}
        </span>
      </div>

      <table className="mt-4 w-full border-collapse text-left text-xs">
        <thead className="text-muted-foreground">
          <tr>
            {["Customer", "Date", "Amount"].map((head) => (
              <th key={head} className="border-b border-border pb-2 font-medium">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "border-b border-border/60 py-2.5 pr-3",
                    tone === "messy" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {cell || "\u2014"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export function BeforeAfter() {
  return (
    <section id="before-after" className="scene-3d mx-auto max-w-6xl px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Before vs after</h2>
        <p className="mt-4 text-muted-foreground">
          Same file, 20 seconds later. Hover a sheet to bring it forward.
        </p>
      </Reveal>

      <div className="mt-14 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <Sheet title="messy-export.csv" rows={MESSY} tone="messy" rotate={12} />
        <motion.span
          aria-hidden
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40"
        >
          <ArrowRight className="h-5 w-5" />
        </motion.span>
        <Sheet title="cleaned.xlsx" rows={CLEAN} tone="clean" rotate={-12} />
      </div>
    </section>
  );
}
