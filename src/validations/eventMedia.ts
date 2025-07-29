import { z } from "zod";

export const eventMediaSchema = z.object({
  // media: z
  //   .union([
  //     z.instanceof(File), // Single file
  //     z.array(z.instanceof(File)).min(1, "Please upload at least one file"), // Multiple files
  //   ])
  //   .refine(
  //     (val) => {
  //       if (val instanceof File) return true;
  //       if (Array.isArray(val)) return val.length > 0;
  //       return false;
  //     },
  //     { message: "Please upload at least one file" }
  //   ),
  media: z.any(),
});
export type EventMediaRequest = z.infer<typeof eventMediaSchema>;
