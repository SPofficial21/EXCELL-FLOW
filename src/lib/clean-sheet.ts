import * as XLSX from "xlsx";

export type CleanReport = {
  rowsIn: number;
  rowsOut: number;
  duplicatesRemoved: number;
  emptyRowsRemoved: number;
  cellsTrimmed: number;
  headers: string[];
  preview: string[][];
};

export type CleanResult = {
  report: CleanReport;
  workbook: XLSX.WorkBook;
};

const ACCEPTED = [".csv", ".xls", ".xlsx"];

export function isSupportedFile(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED.some((ext) => lower.endsWith(ext));
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).replace(/\s+/g, " ").trim();
}

/**
 * Trims whitespace, drops fully empty rows and exact duplicate rows from the
 * first sheet of a workbook.
 */
export function cleanWorkbook(input: XLSX.WorkBook): CleanResult {
  const sheetName = input.SheetNames[0];
  const sheet = input.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });

  let cellsTrimmed = 0;
  let emptyRowsRemoved = 0;
  let duplicatesRemoved = 0;

  const normalized: string[][] = [];
  for (const row of rows) {
    const cleanedRow = row.map((cell) => {
      const raw = cell === null || cell === undefined ? "" : String(cell);
      const cleaned = normalizeCell(cell);
      if (cleaned !== raw) cellsTrimmed += 1;
      return cleaned;
    });
    if (cleanedRow.every((cell) => cell === "")) {
      emptyRowsRemoved += 1;
      continue;
    }
    normalized.push(cleanedRow);
  }

  const [headers = [], ...body] = normalized;
  const seen = new Set<string>();
  const deduped: string[][] = [];
  for (const row of body) {
    const key = row.join("\u0001").toLowerCase();
    if (seen.has(key)) {
      duplicatesRemoved += 1;
      continue;
    }
    seen.add(key);
    deduped.push(row);
  }

  const outputRows = headers.length ? [headers, ...deduped] : deduped;
  const outSheet = XLSX.utils.aoa_to_sheet(outputRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, outSheet, "Cleaned");

  return {
    workbook,
    report: {
      rowsIn: rows.length,
      rowsOut: outputRows.length,
      duplicatesRemoved,
      emptyRowsRemoved,
      cellsTrimmed,
      headers,
      preview: deduped.slice(0, 5),
    },
  };
}

export async function cleanFile(file: File): Promise<CleanResult> {
  const buffer = await file.arrayBuffer();
  return cleanWorkbook(XLSX.read(buffer, { type: "array", cellDates: true }));
}
