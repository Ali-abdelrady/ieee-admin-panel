// src/validations/partner.ts
import { z } from "zod";

export const partnerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z
    .any()
    .refine((val) => val instanceof File || typeof val === "string", {
      message: "Image is required",
    }),
  isSeasonPartner: z.boolean().default(false),
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
