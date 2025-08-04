import { CommitteeType } from "./committee";

export interface MemberType {
  id: number;
  name: string;
  nationalId?: string;
  status?: string;
  password: string;
  email: string;
  personalEmail: string;
  role: string;
  phone: string;
  university: string;
  faculty: string;
  internalRoleId?: string;
  committeeId?: string;
  committee?: CommitteeType;
}
export interface ApiResponse<T> {
  data?: {
    members: T;
  };
  message?: string;
}

export type MemberRequest = Omit<MemberType, "id">;
export type MemberResponse = ApiResponse<MemberType>;
export type MembersResponse = ApiResponse<MemberType[]>;
