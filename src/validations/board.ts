// src/validations/board.ts
import { z } from "zod";
import { socialLinksSchema } from "./commonValidations";

export const boardFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  position: z.string().min(1, "Position is required"),
  name: z.string().min(1, "Name is required"),
  // socialLinks: z.array(socialLinksSchema),
  socialLinks: z.any(),
  image: z.any(), // Custom validation for file uploads
});
