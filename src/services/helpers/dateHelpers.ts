import { format, parseISO } from "date-fns";

export function formatDate(rawData: string) {
  const date = parseISO(rawData);
  const formatted = format(date, "PPP"); // "Jul 20, 2025"
  return formatted;
}
