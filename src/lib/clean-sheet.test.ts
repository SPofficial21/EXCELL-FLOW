import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import { cleanWorkbook, isSupportedFile } from "./clean-sheet";

function workbookFrom(rows: string[][]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "Sheet1");
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
      workbookFrom([
        ["Name", "Amount"],
        ["  John   Smith ", "10"],
        ["John Smith", "10"],
        ["", ""],
        ["Jane Doe", "20"],
      ]),
    );

    expect(report.duplicatesRemoved).toBe(1);
    expect(report.emptyRowsRemoved).toBe(1);
    expect(report.cellsTrimmed).toBeGreaterThan(0);
    expect(report.rowsOut).toBe(3);
    expect(report.headers).toEqual(["Name", "Amount"]);
  });
});
