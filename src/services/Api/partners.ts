// src/services/Api/admin/events.ts
import { PartnerRequest } from "@/types/partners";
import { PartnersResponse } from "@/types/sponsors";
import { api } from "./api";

export const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<PartnersResponse, void>({
      query: () => `/admin/partners/`,
      providesTags: (result) => {
        const partners = result?.data?.partners ?? [];
        if (partners.length) {
          return [
            ...partners.map((partner) => ({
              type: "Partners" as const,
              id: partner.id.toString(),
            })),
            { type: "Partners" as const, id: "LIST" },
          ];
        }
        return [{ type: "Partners" as const, id: "LIST" }];
      },
    }),

    addPartner: builder.mutation<PartnersResponse, { data: PartnerRequest }>({
      query: ({ data }) => ({
        url: `/admin/partners/`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Partners", id: "LIST" }],
    }),

    updatePartner: builder.mutation<
      PartnersResponse,
      { sponsorId: string; data: PartnerRequest }
    >({
      query: ({ sponsorId, data }) => ({
        url: `/admin/partners/${sponsorId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { sponsorId }) => [
        { type: "Partners", id: sponsorId },
        { type: "Partners", id: "LIST" },
      ],
    }),

    deletePartner: builder.mutation<PartnersResponse, string>({
      query: (sponsorId) => ({
        url: `/admin/partners/${sponsorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, sponsorId) => [
        { type: "Partners", id: sponsorId },
        { type: "Partners", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPartnersQuery,
  useAddPartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = eventApi;
