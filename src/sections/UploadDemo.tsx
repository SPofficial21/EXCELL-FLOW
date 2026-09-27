import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { cleanFile, isSupportedFile, type CleanReport } from "@/lib/clean-sheet";
import { cn } from "@/lib/utils";

type Status = "idle" | "working" | "done" | "error";

export function UploadDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const workbookRef = useRef<XLSX.WorkBook | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [report, setReport] = useState<CleanReport | null>(null);

  const handleFile = async (file: File) => {
    if (!isSupportedFile(file.name)) {
      setStatus("error");
      setMessage("Unsupported file. Upload a .csv, .xls or .xlsx file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setStatus("error");
      setMessage("That file is over 15 MB. Split it or upgrade to Pro for bulk processing.");
      return;
    }

    setFileName(file.name);
    setStatus("working");
    setMessage("Cleaning your data…");

    try {
      const result = await cleanFile(file);
      workbookRef.current = result.workbook;
      setReport(result.report);
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("We couldn't read that file. Try re-exporting it from Excel.");
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const download = () => {
    if (!workbookRef.current) return;
    const base = fileName.replace(/\.[^.]+$/, "");
    XLSX.writeFile(workbookRef.current, `${base}-cleaned.xlsx`);
  };

  return (
    <section id="upload" className="scene-3d mx-auto max-w-4xl px-5 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Try it on your own file</h2>
        <p className="mt-4 text-muted-foreground">
          Everything runs in your browser — nothing is uploaded to a server.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <motion.div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          animate={{ rotateX: dragging ? -6 : 0, scale: dragging ? 1.02 : 1 }}
          style={{ transformPerspective: 1200 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className={cn(
            "glass-panel mt-12 flex flex-col items-center gap-4 border-dashed p-12 text-center transition-colors",
            dragging && "border-primary bg-primary/5",
          )}
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary"
          >
            <UploadCloud className="h-6 w-6" />
          </motion.span>

          <p className="text-sm font-medium">Drag & drop your CSV or Excel file</p>
          <p className="text-xs text-muted-foreground">Max 15 MB · .csv, .xls, .xlsx</p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={onPick}
            data-testid="file-input"
          />
          <Button onClick={() => inputRef.current?.click()}>Choose a file</Button>

          <AnimatePresence mode="wait">
            {status === "working" && (
              <motion.p
                key="working"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                {message}
              </motion.p>
            )}

            {status === "error" && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertTriangle className="h-4 w-4" />
                {message}
              </motion.p>
            )}

            {status === "done" && report && (
              <motion.div
                key="done"
                initial={{ opacity: 0, rotateX: 18, y: 16 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-2xl border border-border bg-background/70 p-5 text-left"
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <FileSpreadsheet className="h-4 w-4 text-accent" />
                  {fileName}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  {[
                    ["Rows in", report.rowsIn],
                    ["Rows out", report.rowsOut],
                    ["Duplicates", report.duplicatesRemoved],
                    ["Cells fixed", report.cellsTrimmed],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-secondary/70 p-3">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="mt-1 text-lg font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
                <Button variant="accent" className="mt-5" onClick={download}>
                  <Download className="h-4 w-4" />
                  Download cleaned file
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Reveal>
    </section>
  );
}
