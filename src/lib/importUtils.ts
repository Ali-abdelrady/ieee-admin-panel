import * as XLSX from "xlsx";

export function ConvertXlsxToJson<T = Record<string, any>>(
  file: File
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return reject("Failed to read file");

      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<T>(sheet); // ✨ add generic type here
        resolve(jsonData);
      } catch (error) {
        reject("Error parsing XLSX file: " + (error as Error).message);
      }
    };

    reader.onerror = () => reject("Error reading file");
    reader.readAsBinaryString(file);
  });
}
