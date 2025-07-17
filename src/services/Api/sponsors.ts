import { api } from "./api";
import {
  SponsorType,
  SponsorRequest,
  SponsorResponse,
  SponsorsResponse,
} from "@/types/sponsors";

export const SponsorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSponsors: builder.query<SponsorsResponse, void>({
      query: () => "/admin/sponsors",
      providesTags: (result) => {
        const data = result?.data?.sponsors ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((sponsor) => ({
              type: "Sponsors" as const,
              id: sponsor.id,
            })),
            { type: "Sponsors" as const, id: "LIST" },
          ];
        }
        return [{ type: "Sponsors" as const, id: "LIST" }];
      },
    }),

    getSponsorById: builder.query<SponsorResponse, string | number>({
      query: (id) => `/admin/sponsors/${id}`,
      providesTags: (result) =>
        result?.data?.sponsors
          ? [
              {
                type: "Sponsors" as const,
                id: result.data.sponsors.id,
              },
              { type: "Sponsors" as const, id: "LIST" },
            ]
          : [{ type: "Sponsors" as const, id: "LIST" }],
    }),

    addSponsor: builder.mutation<SponsorResponse, SponsorRequest>({
      query: (data) => ({
        url: "/admin/sponsors",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Sponsors", id: "LIST" }],
    }),

    updateSponsor: builder.mutation<SponsorResponse, SponsorType>({
      query: (data) => ({
        url: `/admin/sponsors/${data.id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Sponsors", id: arg.id },
        { type: "Sponsors", id: "LIST" },
      ],
    }),

    deleteSponsor: builder.mutation<SponsorResponse, string | number>({
      query: (id) => ({
        url: `/admin/sponsors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Sponsors", id },
        { type: "Sponsors", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddSponsorMutation,
  useGetSponsorsQuery,
  useGetSponsorByIdQuery,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,
} = SponsorApi;
