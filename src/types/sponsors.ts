export interface SponsorType {
  id: number | string;
  name: string;
  url: string;
  image: File | string;
  isSeasonSponsor: boolean;
}
export interface ApiResponse<T> {
  data?: {
    sponsors: T;
  };
  message?: string;
}

export type SponsorRequest = Omit<SponsorType, "id">;
export type SponsorResponse = ApiResponse<SponsorType>;
export type SponsorsResponse = ApiResponse<SponsorType[]>;
