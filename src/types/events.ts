import { string } from "zod";
import { FormFieldType } from ".";
import { SpeakerType } from "./speakers";
import { SponsorType } from "./sponsors";
import { TimelineType } from "./timeline";
import { SocialLinksType } from "./forms";

export interface EventType {
  id: number | string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStart?: string;
  registrationEnd?: string;
  private?: boolean;
  category: "event" | "bootcamp" | "workshop" | "outing";
  formId: number | string;
  location: string;
  images?: string[];
  image?: File;
  videos?: File | string[];
  speakers: SpeakerType[];
  sponsors: SponsorType[];
  eventDays: TimelineType[];
  createdAt: string;
  updatedAt: string;
}
export interface ApiResponse<T> {
  data?: { event: T };
  message?: string;
}
export interface ApiResponses<T> {
  data?: { events: T };
  message?: string;
}

export type EventRequest = Omit<EventType, "id">;
export type EventResponse = ApiResponse<EventType>;
export type EventsResponse = ApiResponses<EventType[]>;

export interface EventDetailsType {
  id?: string;
  speakers?: { id: string; photoId: string }[];
  sponsors?: { id: string; photoId: string }[];
  timeline?: TimelineType[];
  formFields?: FormFieldType[];
}


