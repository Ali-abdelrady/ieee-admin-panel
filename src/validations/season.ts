import { z } from "zod";
import { dateToISO } from "./commonValidations";

export const seasonFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  startDate: dateToISO,
  endDate: dateToISO,
});
