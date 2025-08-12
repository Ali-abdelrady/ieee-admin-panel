// src/services/Api/admin/memberApi.ts
import { api } from "./api";
import { MembersResponse, MemberRequest } from "@/types/member";

export const memberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<MembersResponse, void>({
      query: () => `/admin/members/`,
      providesTags: (result) => {
        const members = result?.data?.members ?? [];
        if (members.length) {
          return [
            ...members.map((member) => ({
              type: "Members" as const,
              id: member.id.toString(),
            })),
            { type: "Members" as const, id: "LIST" },
          ];
        }
        return [{ type: "Members" as const, id: "LIST" }];
      },
    }),

    addMember: builder.mutation<MembersResponse, { data: MemberRequest }>({
      query: ({ data }) => ({
        url: `/admin/members/`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Members", id: "LIST" }],
    }),

    updateMember: builder.mutation<
      MembersResponse,
      { memberId: string; data: MemberRequest }
    >({
      query: ({ memberId, data }) => ({
        url: `/admin/members/${memberId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { memberId }) => [
        { type: "Members", id: memberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    deleteMember: builder.mutation<MembersResponse, string>({
      query: (memberId) => ({
        url: `/admin/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, memberId) => [
        { type: "Members", id: memberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    toggleMemberStatus: builder.mutation<MembersResponse, string>({
      query: (memberId) => ({
        url: `/admin/members/${memberId}/toggle-status`,
        method: "GET",
      }),
      invalidatesTags: (result, error, memberId) => [
        { type: "Members", id: memberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    memberSelector: builder.query<MembersResponse, string>({
      query: (searchQuery) =>
        `/admin/selectors/members?query=${encodeURIComponent(searchQuery)}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useToggleMemberStatusMutation,
  useLazyMemberSelectorQuery,
} = memberApi;
