// src/services/Api/committee.ts
import { api } from "./api";
import {
  CommitteeRequest,
  CommitteeResponse,
  CommitteesResponse,
  CommitteeType,
} from "@/types/committee";

export const CommitteeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommittees: builder.query<CommitteesResponse, void>({
      query: () => "/admin/committees",
      providesTags: (result) => {
        const committees = result?.data?.committees ?? [];
        if (Array.isArray(committees) && committees.length) {
          return [
            ...committees.map((c) => ({
              type: "Committees" as const,
              id: c.id,
            })),
            { type: "Committees" as const, id: "LIST" },
          ];
        }
        return [{ type: "Committees", id: "LIST" }];
      },
    }),

    getCommitteeById: builder.query<CommitteeResponse, string>({
      query: (id) => `/admin/committees/${id}`,
      providesTags: (result, error, id) =>
        result
          ? [
              { type: "Committees", id },
              { type: "Committees", id: "LIST" },
            ]
          : [{ type: "Committees", id: "LIST" }],
    }),

    addCommittee: builder.mutation<CommitteeResponse, CommitteeRequest>({
      query: (data) => ({
        url: "/admin/committees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Committees", id: "LIST" }],
    }),

    updateCommittee: builder.mutation<
      CommitteeResponse,
      CommitteeType | FormData
    >({
      query: (data) => {
        let id: string | number;
        if (data instanceof FormData) {
          id = data.get("id") as string;
        } else {
          id = data.id;
        }
        return {
          url: `/admin/committees/${id}`,
          method: "PATCH",
          body: data,
          formData: data instanceof FormData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        {
          type: "Committees",
          id: arg instanceof FormData ? (arg.get("id") as string) : arg.id,
        },
      ],
    }),

    deleteCommittee: builder.mutation<CommitteeResponse, string | number>({
      query: (id) => ({
        url: `/admin/committees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Committees", id },
        { type: "Committees", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddCommitteeMutation,
  useGetCommitteesQuery,
  useGetCommitteeByIdQuery,
  useUpdateCommitteeMutation,
  useDeleteCommitteeMutation,
} = CommitteeApi;
