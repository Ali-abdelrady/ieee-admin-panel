// src/validations/sponsor.ts
import { z } from "zod";

export const sponsorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url({ message: "Enter Valid URL" }).min(1, "url is required"),
  image: z.union([z.instanceof(File), z.string()], {
    errorMap: () => ({ message: "Image is required" }),
  }),
  isSeasonSponsor: z.boolean(),
});

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>;
