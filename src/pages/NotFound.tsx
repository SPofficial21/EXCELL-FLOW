import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="gradient-text text-6xl font-extrabold">404</p>
      <p className="text-muted-foreground">That page didn't survive the cleanup.</p>
      <Button asChild>
        <Link to="/">Back to ExcelFlow AI</Link>
      </Button>
    </div>
  );
}
