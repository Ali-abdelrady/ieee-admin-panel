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
      providesTags: (result) => {
        const awards = result?.data?.awards ?? [];
        if (Array.isArray(awards) && awards.length) {
          return [
            ...awards.map((a) => ({ type: "Awards" as const, id: a.id })),
            { type: "Awards" as const, id: "LIST" },
          ];
        }
        return [{ type: "Awards" as const, id: "LIST" }];
      },
    }),

    addAward: builder.mutation<AwardResponse, AwardRequest>({
      query: (body) => ({
        url: "/admin/awards",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Awards", id: "LIST" }],
    }),

    updateAward: builder.mutation<AwardResponse, AwardType | FormData>({
      query: (data) => {
        let id: string | number;
        if (data instanceof FormData) {
          id = data.get("id") as string;
        } else {
          id = data.id;
        }
        return {
          url: `/admin/awards/${id}`,
          method: "PATCH",
          body: data,
          formData: data instanceof FormData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        {
          type: "Awards",
          id: arg instanceof FormData ? (arg.get("id") as string) : arg.id,
        },
      ],
    }),

    deleteAward: builder.mutation<AwardResponse, string | number>({
      query: (id) => ({
        url: `/admin/awards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Awards", id },
        { type: "Awards", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAwardsQuery,
  useAddAwardMutation,
  useUpdateAwardMutation,
  useDeleteAwardMutation,
} = awardApi;
