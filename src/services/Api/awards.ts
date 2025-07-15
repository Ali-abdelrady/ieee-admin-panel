import {
  AwardRequest,
  AwardResponse,
  AwardsResponse,
  AwardType,
} from "@/types/awards";
import { api } from "./api";

export const awardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAwards: builder.query<AwardsResponse, void>({
      query: () => "/admin/awards",
      providesTags: ["Awards"],
    }),
    addAward: builder.mutation<AwardResponse, AwardRequest>({
      query: (body) => ({
        url: "/admin/awards",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Awards"],
    }),
    updateAward: builder.mutation<AwardResponse, AwardType>({
      query: ({ id, ...body }) => ({
        url: `/admin/awards/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Awards"],
    }),
    deleteAward: builder.mutation<AwardResponse, string | number>({
      query: (id) => ({
        url: `/admin/awards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Awards"],
    }),
  }),
});

export const {
  useGetAwardsQuery,
  useAddAwardMutation,
  useUpdateAwardMutation,
  useDeleteAwardMutation,
} = awardApi;
