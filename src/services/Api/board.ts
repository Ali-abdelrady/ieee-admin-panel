import { api } from "./api";
import {
  BoardRequest,
  BoardResponse,
  BoardsResponse,
  BoardType,
} from "@/types/board";

export const BoardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query<BoardsResponse, void>({
      query: () => "/board",
      providesTags: (result) => {
        const boards = result?.data?.boards ?? [];
        if (Array.isArray(boards) && boards.length) {
          return [
            ...boards.map((b) => ({ type: "Boards" as const, id: b.id })),
            { type: "Boards" as const, id: "LIST" },
          ];
        }
        return [{ type: "Boards", id: "LIST" }];
      },
    }),

    getBoardById: builder.query<BoardResponse, string>({
      query: (id) => `/board/${id}`,
      providesTags: (result, error, id) =>
        result
          ? [
              { type: "Boards", id },
              { type: "Boards", id: "LIST" },
            ]
          : [{ type: "Boards", id: "LIST" }],
    }),

    addBoard: builder.mutation<BoardResponse, BoardRequest>({
      query: (data) => ({
        url: "/admin/board",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Boards", id: "LIST" }],
    }),

    updateBoard: builder.mutation<BoardResponse, BoardType | FormData>({
      query: (data) => {
        let id: string | number;
        if (data instanceof FormData) {
          id = data.get("id") as string;
        } else {
          id = data.id;
        }
        return {
          url: `/admin/board/${id}`,
          method: "PATCH",
          body: data,
          formData: data instanceof FormData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        {
          type: "Boards",
          id: arg instanceof FormData ? (arg.get("id") as string) : arg.id,
        },
      ],
    }),

    deleteBoard: builder.mutation<BoardResponse, string | number>({
      query: (id) => ({
        url: `/admin/board/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Boards", id },
        { type: "Boards", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddBoardMutation,
  useGetBoardsQuery,
  useGetBoardByIdQuery,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = BoardApi;
