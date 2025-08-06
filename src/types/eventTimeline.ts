import { SpeakerType } from "./speakers";

export interface TimelineType {
  id: number | string;
  date: string;
  label: string;
  eventId: string;
  agendaItems: AgendaItemType[];
}
export interface ApiResponse<T> {
  data?: { timeline: T };
  message?: string;
}

export type TimelineRequest = Omit<TimelineType, "id" | "agendaItems" | "eventId">;
export type TimelineResponse = ApiResponse<TimelineType[]>;

export interface AgendaItemType {
  id: number | string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerId: string;
  speaker: SpeakerType;
}

export interface AgdenaItemApiResponse {
  data?: { message?: string };
}
export type AgendaItemRequest = Omit<AgendaItemType, "id">;
export type AgendaItemResponse = AgdenaItemApiResponse;
