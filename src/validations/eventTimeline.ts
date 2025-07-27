// src/validations/timeline.ts
import { z } from "zod";
import { dateToISO } from "./commonValidations";

export const timelineFormSchema = z.object({
  date: dateToISO,
  label: z.string().min(1, "Label is required"),
});

export type TimelineFormValues = z.infer<typeof timelineFormSchema>;

export const agendaItemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.any(),
  endTime: z.any(),
  speakerId: z.string().min(1, "Speaker is required"),
});

export type AgendaItemFormValues = z.infer<typeof agendaItemFormSchema>;
