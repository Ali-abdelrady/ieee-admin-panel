// src/validations/sponsor.ts
import { z } from "zod";

export const sponsorFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    image: isEdit
      ? z.any().optional()
      : z.any().refine((file) => file instanceof File, "Image is required"),
    isSeasonSponsor: z.boolean().optional(),
    isSeasonPartner: z.boolean().optional(),
  });

export type SponsorFormValues = z.infer<ReturnType<typeof sponsorFormSchema>>;
