import { Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row">
      <p className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        ExcelFlow AI — clean data, instantly.
      </p>
      <div className="flex items-center gap-4">
        <span>© {new Date().getFullYear()} ExcelFlow AI</span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
