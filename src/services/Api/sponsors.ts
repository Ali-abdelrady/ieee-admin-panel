// src/services/Api/admin/sponsors.ts
import { api } from "./api";
import {
  SponsorRequest,
  SponsorResponse,
  SponsorsResponse,
} from "@/types/sponsors";

export const sponsorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSponsors: builder.query<SponsorsResponse, void>({
      query: () => "/admin/sponsors",
      providesTags: (result) => {
        const sponsors = result?.data?.sponsors ?? [];
        if (sponsors.length) {
          return [
            ...sponsors.map((sponsor) => ({
              type: "Sponsors" as const,
              id: sponsor.id.toString(),
            })),
            { type: "Sponsors" as const, id: "LIST" },
          ];
        }
        return [{ type: "Sponsors", id: "LIST" }];
      },
    }),

    getSponsorById: builder.query<SponsorResponse, string | number>({
      query: (id) => `/admin/sponsors/${id}`,
      providesTags: (result, error, id) =>
        result?.data?.sponsors
          ? [
              { type: "Sponsors", id: result.data.sponsors.id.toString() },
              { type: "Sponsors", id: "LIST" },
            ]
          : [
              { type: "Sponsors", id: id.toString() },
              { type: "Sponsors", id: "LIST" },
            ],
    }),

    addSponsor: builder.mutation<SponsorResponse, SponsorRequest | FormData>({
      query: (data) => ({
        url: "/admin/sponsors",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Sponsors", id: "LIST" }],
    }),

    updateSponsor: builder.mutation<
      SponsorResponse,
      { sponsorId: string | number; data: SponsorRequest | FormData }
    >({
      query: ({ data, sponsorId }) => ({
        url: `/admin/sponsors/${sponsorId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { sponsorId }) => [
        { type: "Sponsors", id: sponsorId.toString() },
        { type: "Sponsors", id: "LIST" },
      ],
    }),

    deleteSponsor: builder.mutation<SponsorResponse, string | number>({
      query: (id) => ({
        url: `/admin/sponsors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Sponsors", id: id.toString() },
        { type: "Sponsors", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSponsorsQuery,
  useGetSponsorByIdQuery,
  useAddSponsorMutation,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,
} = sponsorApi;
