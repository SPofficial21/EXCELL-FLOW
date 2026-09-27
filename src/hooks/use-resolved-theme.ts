import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useResolvedTheme(): { isDark: boolean; mounted: boolean } {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { isDark: mounted ? resolvedTheme === "dark" : false, mounted };
}
