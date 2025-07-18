export default interface SocialLinks {
  url: string;
  icon: string;
  name: string;
}
export interface BoardType {
  id: number;
  title: string;
  name: string;
  position: string;
  socialLinks?: SocialLinks[];
  image?: File | string;
}
export interface ApiResponse<T> {
  data?: {
    board: T;
  };
  message?: string;
}

export type BoardRequest = Omit<BoardType, "id">;
export type BoardResponse = ApiResponse<BoardType>;
export type BoardsResponse = ApiResponse<BoardType[]>;
