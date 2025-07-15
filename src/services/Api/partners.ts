// src/services/Api/admin/partners.ts
import { api } from "./api";
import {
  PartnerRequest,
  PartnerResponse,
  PartnersResponse,
  PartnerType,
} from "@/types/partners";

export const PartnerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<PartnersResponse, void>({
      query: () => "/admin/partners",
      providesTags: (result) => {
        const data = result?.data?.partners ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Partners" as const,
              id: e.id,
            })),
            { type: "Partners" as const, id: "LIST" },
          ];
        }
        return [{ type: "Partners" as const, id: "LIST" }];
      },
    }),
    getPartnerById: builder.query<PartnerResponse, string>({
      query: (id) => `/admin/partners/${id}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Partners" as const, id: result?.data?.partners?.id },
              { type: "Partners" as const, id: "LIST" },
            ]
          : [{ type: "Partners" as const, id: "LIST" }],
    }),
    addPartner: builder.mutation<PartnerResponse, PartnerRequest>({
      query: (data) => ({
        url: "/admin/partners",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Partners", id: "LIST" }],
    }),
    updatePartner: builder.mutation<PartnerResponse, PartnerType>({
      query: (data) => ({
        url: `/admin/partners/${data.id}`,
        method: "PATCH",
        body: {
          ...data,
        },
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Partners", id: arg.id },
        { type: "Partners", id: "LIST" },
      ],
    }),
    deletePartner: builder.mutation<PartnerResponse, string | number>({
      query: (id) => ({
        url: `/admin/partners/${id.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Partners", id },
        { type: "Partners", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddPartnerMutation,
  useGetPartnersQuery,
  useGetPartnerByIdQuery,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = PartnerApi;
