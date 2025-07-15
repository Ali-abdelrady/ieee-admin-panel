export interface FAQType {
  id: number;
  question: string;
  answer: string;
}
export interface ApiResponse<T> {
  data?: { faqs: T };
  message?: string;
}

export type FAQRequest = Omit<FAQType, "id">;
export type FAQResponse = ApiResponse<FAQType>;
export type FAQsResponse = ApiResponse<FAQType[]>;
