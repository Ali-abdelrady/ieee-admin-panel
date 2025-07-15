import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import autoTable from "jspdf-autotable";

// Helper function to filter out empty values from an object
const filterEmptyValues = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  ) as Partial<T>;
};

export function exportToCSV<T extends Record<string, any>>(
  rows: T[],
  fileName = "data"
) {
  const filteredRows = rows.map((row) => filterEmptyValues(row));
  const csv = Papa.unparse(filteredRows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
}

export function exportToJSON<T extends Record<string, any>>(
  rows: T[],
  fileName = "data"
) {
  const filteredRows = rows.map((row) => filterEmptyValues(row));
  const json = JSON.stringify(filteredRows, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  saveAs(blob, `${fileName}.json`);
}

export function exportToExcel<T extends Record<string, any>>(
  rows: T[],
  fileName = "data"
) {
  const filteredRows = rows.map((row) => filterEmptyValues(row));
  const worksheet = XLSX.utils.json_to_sheet(filteredRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToPDF<T extends Record<string, any>>(
  rows: T[],
  fileName = "data"
) {
  const doc = new jsPDF();

  if (rows.length === 0) {
    doc.text("No data available", 10, 10);
    doc.save(`${fileName}.pdf`);
    return;
  }

  // First filter empty values from each row
  const filteredRows = rows.map((row) => filterEmptyValues(row));

  // Get headers from the first non-empty row
  const headers = Object.keys(filteredRows[0]);

  const data = filteredRows.map((row) =>
    headers.map((key) => {
      const value = row[key];
      return value !== null && value !== undefined ? String(value) : "";
    })
  );

  autoTable(doc, {
    head: [headers],
    body: data,
  });

  doc.save(`${fileName}.pdf`);
}
