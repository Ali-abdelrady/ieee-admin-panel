import { z } from "zod";

export const dateToISO = z
  .date({ required_error: "Date is requierd" })
  .transform((val) => val.toISOString());

export const fileFormSchema = z.object({
  files: z
    .any()
    .refine((files) => files?.length > 0, "Please upload at least one file"),
});
export const socialLinksSchema = z.object({
  url: z.string().url("Invalid URL format"),
  icon: z.string().min(1, "Icon is required"),
  name: z.string().min(1, "Name is required"),
});
