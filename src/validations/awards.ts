import { z } from "zod";
import { dateToISO } from "./commonValidations";

export const awardFormSchema = z.object({
  image: z.union([z.instanceof(File), z.string().url()]),
  title: z.string().min(1, "Title is required"),
  winningDate: dateToISO,
  place: z.string().min(1, "Place is required"),
  description: z.string().min(1, "Description is required"),
});
