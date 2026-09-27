import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useResolvedTheme } from "@/hooks/use-resolved-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const { isDark, mounted } = useResolvedTheme();

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      data-testid="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative h-10 w-[4.5rem] rounded-full border border-border bg-secondary/80 p-1 backdrop-blur transition-colors duration-500",
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--glow) / 0.55), transparent 70%)",
        }}
      />
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 480, damping: 32 }}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md",
          isDark ? "ml-auto" : "ml-0",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mounted && isDark ? "moon" : "sun"}
            initial={{ rotateY: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.28 }}
            className="flex items-center justify-center"
          >
            {mounted && isDark ? (
              <Moon className="h-4 w-4 text-primary" />
            ) : (
              <Sun className="h-4 w-4 text-accent" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
