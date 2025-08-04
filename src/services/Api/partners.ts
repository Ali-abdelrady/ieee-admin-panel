// src/services/Api/admin/events.ts
import { PartnerRequest } from "@/types/partners";
import { api } from "./api";
import { PartnersResponse, SponsorRequest } from "@/types/sponsors";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Event partners endpoints
    addPartner: builder.mutation<PartnersResponse, { data: PartnerRequest }>({
      query: ({ data }) => ({
        url: `/admin/partners/`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Partners", id: "LIST" },
      ],
    }),

    getPartners: builder.query<PartnersResponse, void>({
      query: () => `/admin/partners/`, // ✅ Required
      providesTags: (result) => {
        const data = result?.data?.partners ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Partners" as const,
              id: e.id.toString(),
            })),
            { type: "Partners" as const, id: "LIST" },
          ];
        }
        return [{ type: "Partners" as const, id: "LIST" }];
      },
    }),

    deletePartner: builder.mutation<PartnersResponse, string>({
      query: (sponsorId) => ({
        url: `/admin/partners/${sponsorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        // { type: "Partners", id: arg.sponsorId },
        { type: "Partners", id: "LIST" },
      ],
    }),

    updatePartner: builder.mutation<
      PartnersResponse,
      { data: PartnerRequest; sponsorId: string }
    >({
      query: ({ data, sponsorId }) => ({
        url: `/admin/partners/${sponsorId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        // { type: "Partners", id: arg.sponsorId },
        { type: "Partners", id: arg.sponsorId },
        { type: "Partners", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddPartnerMutation,
  useGetPartnersQuery,
  useDeletePartnerMutation,
  useUpdatePartnerMutation,
} = EventApi;
