import { SocialLinksType } from "./forms";

export interface SpeakerType {
  id: number;
  name: string;
  title: string;
  job?: string;
  company?: string;
  socialLinks?: SocialLinksType[];
  bio?: string;
  image?: File | string;
}
export interface ApiResponse<T> {
  data?: {
    speakers: T;
  };
  message?: string;
}
export interface ApiSingleSpeakerResponse<T> {
  data?: {
    speaker: T;
    imageId?: string;
  };
  message?: string;
}

export type SpeakerRequest = Omit<SpeakerType, "id">;
export type SpeakerResponse = ApiSingleSpeakerResponse<SpeakerType>;
export type SpeakersResponse = ApiResponse<SpeakerType[]>;
