// src/services/Api/post.ts
import { api } from "./api";
import {
  PostRequest,
  PostResponse,
  PostsResponse,
  PostType,
} from "@/types/post";

export const PostApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, void>({
      query: () => "/posts",
      providesTags: (result) => {
        const data = result?.data?.posts ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Posts" as const,
              id: e.id,
            })),
            { type: "Posts" as const, id: "LIST" },
          ];
        }
        return [{ type: "Posts" as const, id: "LIST" }];
      },
    }),
    getPostById: builder.query<PostResponse, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Posts" as const, id: result?.data?.posts?.id },
              { type: "Posts" as const, id: "LIST" },
            ]
          : [{ type: "Posts" as const, id: "LIST" }],
    }),
    addPost: builder.mutation<PostResponse, PostRequest>({
      query: (data) => ({
        url: "/admin/posts",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    updatePost: builder.mutation<PostResponse, PostType>({
      query: (data) => ({
        url: `/admin/posts/${data.id}`,
        method: "PATCH",
        body: {
          ...data,
        },
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Posts", id: arg.id },
        { type: "Posts", id: "LIST" },
      ],
    }),
    deletePost: builder.mutation<PostResponse, string | number>({
      query: (id) => ({
        url: `/admin/posts/${id.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Posts", id },
        { type: "Posts", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddPostMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = PostApi;
