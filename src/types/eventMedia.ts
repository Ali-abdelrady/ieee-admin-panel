export interface ApiResponse {
  data?: {
    eventMedia: {
      videos: MediaType[];
      images: MediaType[];
    };
  };
  message?: string;
}

export interface MediaType {
  id: string;
  url: string;
  type: string;
}
export type EventMediaRequest = { media: File | File[] };
export type EventMediaResponse = ApiResponse;
