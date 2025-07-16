import { format, parseISO } from "date-fns";

export function formatDate(rawData: string) {
  const date = parseISO(rawData);
  const formatted = format(date, "PPP"); // "Jul 20, 2025"
  return formatted;
}
export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
