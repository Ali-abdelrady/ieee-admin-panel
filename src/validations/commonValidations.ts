import { z } from "zod";

const platformSchema = z
  .string()
  .refine(
    (val) =>
      ["facebook", "twitter", "instagram", "linkedin", "behance"].includes(val),
    { message: "Please select a valid platform" }
  );

export const dateToISO = z
  .preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date({ required_error: "Date is required" }))
  .transform((val) => val.toISOString());

export const fileFormSchema = z.object({
  files: z
    .any()
    .refine((files) => files?.length > 0, "Please upload at least one file"),
});
export const socialLinksSchema = z.object({
  url: z.string().url("Invalid URL format"),
  platform: platformSchema,
  // icon: z.string().min(1, "Icon is required"),
  // name: z.string().min(1, "Name is required"),
});
export const timeSchema = z
  .preprocess((val) => {
    if (typeof val !== "string" || val.trim() === "") return undefined;

    // Convert 12-hour format (like "10:30 AM") to 24-hour format (like "10:30")
    const match = val.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      let [_, hour, minute, meridian] = match;
      let h = parseInt(hour, 10);
      if (meridian.toUpperCase() === "PM" && h !== 12) h += 12;
      if (meridian.toUpperCase() === "AM" && h === 12) h = 0;
      hour = h.toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }

    return val; // Assume already in HH:MM format
  }, z.string({ required_error: "Time is required" }).regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"))
  .transform((time) => {
    const [hh, mm] = time.split(":");
    return `${hh},${mm}`;
  });
