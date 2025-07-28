import { SpeakerType } from "@/types/speakers";

// Event Speakres
export interface EventSpeakerType {
  id: string;
  eventId: string;
  speakerId: string;
  photoId: string;
  speaker: SpeakerType;
}
export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

interface AddEventSpeakerType {
  image: File;
  speakerId: string;
}
export type EventSpeakerRequest = AddEventSpeakerType;
export type EventSpeakerResponse = ApiResponse<EventSpeakerType[]>;
