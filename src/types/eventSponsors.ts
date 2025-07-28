import { SponsorType } from "./sponsors";

export interface EventSponsorType {
  id: string;
  eventId: string;
  sponsorId: string;
  photoId: string;
  sponsor: SponsorType;
}
export interface ApiResponse<T> {
  data?: T;
  message?: string;
}
export type EventSponsorRequest = {
  sponsorId?: string;
} & Omit<SponsorType, "id">;
// export type EventSponsorRequest = Omit<EventSponsorType, "id">;
export type EventSponsorResponse = ApiResponse<EventSponsorType[]>;
