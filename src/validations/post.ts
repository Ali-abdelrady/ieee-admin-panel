// src/validations/post.ts
import { description } from "@/components/charts/barChartVertical";
import { z } from "zod";
import { fileFormSchema } from "./commonValidations";

export const postFormSchema = z.object({
  // authorId: z.string().min(1, "Author ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  images: z.any(), // Custom validation can be added for files
  private: z.boolean().default(false),
});
