import * as XLSX from "xlsx";

export type CleanReport = {
  rowsIn: number;
  rowsOut: number;
  duplicatesRemoved: number;
  emptyRowsRemoved: number;
  cellsTrimmed: number;
  sheets: string[];
  headers: string[];
  preview: string[][];
};

export type CleanResult = {
  report: CleanReport;
  workbook: XLSX.WorkBook;
};

const ACCEPTED = [".csv", ".xls", ".xlsx"];

const FORMULA_PREFIX = /^[=+@\t\r]|^-(?![\d.])/;

export function isSupportedFile(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED.some((ext) => lower.endsWith(ext));
}

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).replace(/\s+/g, " ").trim();
}

/** Neutralizes cells a spreadsheet app would evaluate as a formula. */
function defuseFormula(value: string): string {
  return FORMULA_PREFIX.test(value) ? `'${value}` : value;
}

type SheetStats = {
  rows: string[][];
  rowsIn: number;
  cellsTrimmed: number;
  emptyRowsRemoved: number;
  duplicatesRemoved: number;
};

function cleanSheet(sheet: XLSX.WorkSheet): SheetStats {
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
      return defuseFormula(cleaned);
    });
    if (cleanedRow.every((cell) => cell === "")) {
      emptyRowsRemoved += 1;
      continue;
    }
    normalized.push(cleanedRow);
  }

  const [headers, ...body] = normalized;
  const seen = new Set<string>();
  const deduped: string[][] = [];
  for (const row of body) {
    const key = row.join("\u0001");
    if (seen.has(key)) {
      duplicatesRemoved += 1;
      continue;
    }
    seen.add(key);
    deduped.push(row);
  }

  return {
    rows: headers ? [headers, ...deduped] : deduped,
    rowsIn: rows.length,
    cellsTrimmed,
    emptyRowsRemoved,
    duplicatesRemoved,
  };
}

/**
 * Trims whitespace and drops empty and duplicate rows from every sheet of a
 * workbook. Values are emitted as text, so numeric formats and formulas from
 * the source workbook are not carried over.
 */
export function cleanWorkbook(input: XLSX.WorkBook): CleanResult {
  const workbook = XLSX.utils.book_new();

  let rowsIn = 0;
  let rowsOut = 0;
  let cellsTrimmed = 0;
  let emptyRowsRemoved = 0;
  let duplicatesRemoved = 0;
  let headers: string[] = [];
  let preview: string[][] = [];

  input.SheetNames.forEach((name, index) => {
    const stats = cleanSheet(input.Sheets[name]);
    rowsIn += stats.rowsIn;
    rowsOut += stats.rows.length;
    cellsTrimmed += stats.cellsTrimmed;
    emptyRowsRemoved += stats.emptyRowsRemoved;
    duplicatesRemoved += stats.duplicatesRemoved;

    if (index === 0) {
      headers = stats.rows[0] ?? [];
      preview = stats.rows.slice(1, 6);
    }

    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(stats.rows), name.slice(0, 31));
  });

  return {
    workbook,
    report: {
      rowsIn,
      rowsOut,
      duplicatesRemoved,
      emptyRowsRemoved,
      cellsTrimmed,
      sheets: input.SheetNames,
      headers,
      preview,
    },
  };
}

export async function cleanFile(file: File): Promise<CleanResult> {
  const buffer = await file.arrayBuffer();
  return cleanWorkbook(XLSX.read(buffer, { type: "array", cellDates: true }));
}
