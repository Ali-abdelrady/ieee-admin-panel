import { z } from "zod";
import { dateToISO } from "./commonValidations";

export const agendaFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Name is required" }),
  startTime: dateToISO,
  endTime: dateToISO,
  speakerId: z.string().min(1, { message: "Speaker is required" }),
});

export const timelineFormSchema = z.object({
  date: dateToISO,
  label: z.string().min(1, { message: "Label is Required" }),
  agenda: z.array(agendaFormSchema),
});

export type AgendaFormSchemaType = z.infer<typeof agendaFormSchema>;
