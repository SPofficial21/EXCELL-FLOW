import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import { cleanWorkbook, isSupportedFile } from "./clean-sheet";

function workbookFrom(sheets: Record<string, string[][]>): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);
  }
  return wb;
}

describe("isSupportedFile", () => {
  it("accepts spreadsheet extensions and rejects others", () => {
    expect(isSupportedFile("data.CSV")).toBe(true);
    expect(isSupportedFile("data.xlsx")).toBe(true);
    expect(isSupportedFile("data.pdf")).toBe(false);
  });
});

describe("cleanWorkbook", () => {
  it("trims cells and removes empty and duplicate rows", () => {
    const { report } = cleanWorkbook(
      workbookFrom({
        Sheet1: [
          ["Name", "Amount"],
          ["  John   Smith ", "10"],
          ["John Smith", "10"],
          ["", ""],
          ["Jane Doe", "20"],
        ],
      }),
    );

    expect(report.duplicatesRemoved).toBe(1);
    expect(report.emptyRowsRemoved).toBe(1);
    expect(report.cellsTrimmed).toBeGreaterThan(0);
    expect(report.rowsOut).toBe(3);
    expect(report.headers).toEqual(["Name", "Amount"]);
  });

  it("keeps rows that differ only by case", () => {
    const { report } = cleanWorkbook(
      workbookFrom({
        Sheet1: [
          ["SKU", "Price"],
          ["Part-A", "10"],
          ["part-a", "10"],
        ],
      }),
    );

    expect(report.duplicatesRemoved).toBe(0);
    expect(report.rowsOut).toBe(3);
  });

  it("cleans every sheet and keeps its name", () => {
    const { workbook, report } = cleanWorkbook(
      workbookFrom({
        Sales: [["Name"], ["Ana"]],
        Invoices: [["Id"], ["  7 "], ["7"]],
      }),
    );

    expect(workbook.SheetNames).toEqual(["Sales", "Invoices"]);
    expect(report.sheets).toEqual(["Sales", "Invoices"]);
    expect(report.duplicatesRemoved).toBe(1);
  });

  it("neutralizes cells that would be evaluated as formulas", () => {
    const { workbook } = cleanWorkbook(
      workbookFrom({
        Sheet1: [
          ["Note", "Delta"],
          ["=HYPERLINK(\"http://evil\")", "-12.5"],
        ],
      }),
    );

    const rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets.Sheet1, { header: 1 });
    expect(rows[1][0]).toBe("'=HYPERLINK(\"http://evil\")");
    expect(rows[1][1]).toBe("-12.5");
  });
});
