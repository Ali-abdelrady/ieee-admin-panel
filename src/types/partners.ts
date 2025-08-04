export interface PartnerType {
  id: number;
  name: string;
  image: File | string;
  images?: string[];
  isSeasonPartner: boolean;
}
export interface ApiResponse<T> {
  data?: {
    partners: T;
  };
  message?: string;
}

export type PartnerRequest = Omit<PartnerType, "id">;
export type PartnerResponse = ApiResponse<PartnerType>;
export type PartnersResponse = ApiResponse<PartnerType[]>;
