// src/validations/committee.ts
import { z } from "zod";
import { fileFormSchema } from "./commonValidations";

const topicSchema = z.object({
  title: z.string().min(1, { message: "Topic is required" }),
  content: z.string().min(1, { message: "content is required" }),
});
export const committeeFormSchema = z.object({
  headIds: z.array(z.string()),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.union([z.instanceof(File), z.string()]),
  topics: z.array(topicSchema),
});
