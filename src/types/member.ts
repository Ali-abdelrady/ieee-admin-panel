export interface MemberType {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  roles: string[];
  phone: string;
  university: string;
  faculty: string;
}
export interface ApiResponse<T> {
  data?: {
    boardMember: T;
  };
  message?: string;
}

export type MemberRequest = Omit<MemberType, "id">;
export type MemberResponse = ApiResponse<MemberType>;
export type MembersResponse = ApiResponse<MemberType[]>;
