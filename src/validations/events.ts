// src/validations/event.ts
import { z } from "zod";
import { dateToISO } from "./commonValidations";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: dateToISO,
  endDate: dateToISO,
  private: z.coerce
    .boolean()
    .default(false)
    .transform((val) => String(val)),
  category: z.enum(["event", "bootcamp", "workshop", "outing"]),
  location: z.string().min(1, "Location is required"),
  image: z.any().optional(),
  videos: z.any().optional(),
  registrationStart: dateToISO.optional(),
  registrationEnd: dateToISO.optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
