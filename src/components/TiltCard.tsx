import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function TiltCard({ children, className, intensity = 12 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, hsl(var(--glow) / 0.22), transparent 62%)`;

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * intensity * 2);
    rotateX.set((0.5 - py) * intensity * 2);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ translateZ: 24, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("glass-panel relative overflow-hidden p-6", className)}
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="relative" style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
