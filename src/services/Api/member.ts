import { api } from "./api";
import { MembersResponse, MemberRequest } from "@/types/member";

export const MemberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Event members endpoints
    addMember: builder.mutation<MembersResponse, { data: MemberRequest }>({
      query: ({ data }) => ({
        url: `/admin/members/`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Members", id: "LIST" },
      ],
    }),

    getMembers: builder.query<MembersResponse, void>({
      query: () => `/admin/members/`,
      providesTags: (result) => {
        const data = result?.data?.members ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Members" as const,
              id: e.id.toString(),
            })),
            { type: "Members" as const, id: "LIST" },
          ];
        }
        return [{ type: "Members" as const, id: "LIST" }];
      },
    }),

    deleteMember: builder.mutation<MembersResponse, string>({
      query: (memberId) => ({
        url: `/admin/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Members", id: id },
        { type: "Members", id: "LIST" },
      ],
    }),
    toggleMemberStatus: builder.mutation<MembersResponse, string>({
      query: (memberId) => ({
        url: `/admin/members/${memberId}/toggle-status`,
        method: "GET",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Members", id: id },
        { type: "Members", id: "LIST" },
      ],
    }),

    updateMember: builder.mutation<
      MembersResponse,
      { data: MemberRequest; memberId: string }
    >({
      query: ({ data, memberId }) => ({
        url: `/admin/members/${memberId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Members", id: arg.memberId },
        { type: "Members", id: "LIST" },
      ],
    }),
    memberSelector: builder.query<MembersResponse, string>({
      query: (searchQuery) => `/admin/selectors/members?query=${searchQuery}`,
      // invalidatesTags: (result, error, arg) => [
      //   { type: "Members", id: arg.memberId },
      //   { type: "Members", id: "LIST" },
      // ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddMemberMutation,
  useGetMembersQuery,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
  useToggleMemberStatusMutation,
  useLazyMemberSelectorQuery,
} = MemberApi;
