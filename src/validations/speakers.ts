// src/validations/speaker.ts
import { z } from "zod";
import { socialLinksSchema } from "./commonValidations";

export const speakerFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    // job: z.string().optional(),
    // company: z.string().optional(),
    // bio: z.string().optional(),
    // image: z.union([z.instanceof(File), z.string()], {
    //   errorMap: () => ({ message: "Image is required" }),
    // }),
    // socialLinks: z.array(socialLinksSchema).optional(),
    image: isEdit
      ? z.any().optional()
      : z.any().refine((file) => file instanceof File, "Image is required"),

    socialLinks: z.any(),
  });

export type SpeakerFormValues = z.infer<ReturnType<typeof speakerFormSchema>>;
