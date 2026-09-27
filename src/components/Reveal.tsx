import type { ReactNode } from "react";
import { motion } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Rotation applied on the X axis while entering, in degrees. */
  rotate?: number;
};

export function Reveal({ children, className, delay = 0, rotate = 14 }: RevealProps) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 48, rotateX: rotate }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
