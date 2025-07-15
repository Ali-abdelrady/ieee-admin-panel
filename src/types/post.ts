export interface PostType {
  id: number;
  authorId?: string;
  title: string;
  content: string;
  images?: File | string[];
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ApiResponse<T> {
  data?: {
    posts: T;
  };
  message?: string;
}

export type PostRequest = Omit<PostType, "id" | "authorId">;
export type PostResponse = ApiResponse<PostType>;
export type PostsResponse = ApiResponse<PostType[]>;
