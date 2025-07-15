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
        const data = result?.data?.committees ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Committees" as const,
              id: e.id,
            })),
            { type: "Committees" as const, id: "LIST" },
          ];
        }
        return [{ type: "Committees" as const, id: "LIST" }];
      },
    }),
    getCommitteeById: builder.query<CommitteeResponse, string>({
      query: (id) => `/admin/committees/${id}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Committees" as const, id: result?.data?.committees?.id },
              { type: "Committees" as const, id: "LIST" },
            ]
          : [{ type: "Committees" as const, id: "LIST" }],
    }),
    addCommittee: builder.mutation<CommitteeResponse, CommitteeRequest>({
      query: (data) => ({
        url: "/admin/committees",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Committees", id: "LIST" }],
    }),
    updateCommittee: builder.mutation<CommitteeResponse, CommitteeType>({
      query: (data) => ({
        url: `/admin/committees/${data.id}`,
        method: "PATCH",
        body: {
          ...data,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Committees", id: arg.id },
        { type: "Committees", id: "LIST" },
      ],
    }),
    deleteCommittee: builder.mutation<CommitteeResponse, string | number>({
      query: (id) => ({
        url: `/admin/committees/${id.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Committees", id },
        { type: "Committees", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddCommitteeMutation,
  useGetCommitteesQuery,
  useGetCommitteeByIdQuery,
  useUpdateCommitteeMutation,
  useDeleteCommitteeMutation,
} = CommitteeApi;
