// src/validations/speaker.ts
import { z } from "zod";
import { socialLinksSchema } from "./commonValidations";

export const speakerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  job: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  image: z
    .any()
    .refine((val) => val instanceof File || typeof val === "string", {
      message: "Image is required",
    }),
  socialLinks: z.array(socialLinksSchema).optional(),
});

export type SpeakerFormValues = z.infer<typeof speakerFormSchema>;
