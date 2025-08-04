export interface SponsorType {
  id: number | string;
  name: string;
  url?: string;
  image: File | string;
  images?: { id: string; url: string };
  isSeasonSponsor?: boolean;
  isSeasonPartner?: boolean;
}
export interface SponsorApiResponse<T> {
  data?: {
    sponsors: T;
  };
  message?: string;
}
export interface PartnerApiResponse<T> {
  data?: {
    partners: T;
  };
  message?: string;
}

export type SponsorRequest = Omit<SponsorType, "id">;
export type SponsorResponse = SponsorApiResponse<SponsorType>;
export type SponsorsResponse = SponsorApiResponse<SponsorType[]>;
export type PartnersResponse = PartnerApiResponse<SponsorType[]>;
