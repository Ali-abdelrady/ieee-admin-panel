export interface AwardType {
  id: number;
  title: string;
  description: string;
  winningDate: string;
  place: string;
  image?: File | string;
}
export interface ApiResponse<T> {
  data?: { awards: T };
  message?: string;
}

export type AwardRequest = Omit<AwardType, "id">;
export type AwardResponse = ApiResponse<AwardType>;
export type AwardsResponse = ApiResponse<AwardType[]>;
