export interface CommitteTopicType {
  title: string;
  content: string;
}
export interface CommitteeType {
  id: number;
  headId: string;
  name: string;
  description: string;
  image: File | string;
  topics: CommitteTopicType[];
}
export interface ApiResponse<T> {
  data?: {
    committees: T;
  };
  message?: string;
}

export type CommitteeRequest = Omit<CommitteeType, "id">;
export type CommitteeResponse = ApiResponse<CommitteeType>;
export type CommitteesResponse = ApiResponse<CommitteeType[]>;
