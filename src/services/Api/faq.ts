// src/services/Api/admin/faq.ts
import { api } from "./api";
import { FAQRequest, FAQResponse, FAQsResponse, FAQType } from "@/types/faq";

export const FaqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<FAQsResponse, void>({
      query: () => ({
        url: "/admin/faq",
        // ← Add this
      }),
      providesTags: (result) => {
        const data = result?.data ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Faqs" as const,
              id: e.id,
            })),
            { type: "Faqs" as const, id: "LIST" },
          ];
        }
        return [{ type: "Faqs" as const, id: "LIST" }];
      },
    }),
    getFaqById: builder.query<FAQResponse, string>({
      query: (id) => ({
        url: `/admin/faq/${id}`,
        // ← Add this
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Faqs" as const, id: result?.data?.id },
              { type: "Faqs" as const, id: "LIST" },
            ]
          : [{ type: "Faqs" as const, id: "LIST" }],
    }),
    addFaq: builder.mutation<FAQResponse, FAQRequest>({
      query: (data) => ({
        url: "/admin/faq",
        method: "POST",
        body: data,
        // ← Add this
      }),
      invalidatesTags: [{ type: "Faqs", id: "LIST" }],
    }),
    updateFaq: builder.mutation<FAQResponse, FAQType>({
      query: (data) => ({
        url: `/admin/faq/${data.id}`,
        method: "PATCH",
        body: {
          ...data,
        },
        // ← Add this
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Faqs", id: arg.id },
        { type: "Faqs", id: "LIST" },
      ],
    }),
    deleteFaq: builder.mutation<FAQResponse, string | number>({
      query: (id) => ({
        url: `/admin/faq/${id.toString()}`,
        method: "DELETE",
        // ← Add this
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Faqs", id },
        { type: "Faqs", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});
export const {
  useAddFaqMutation,
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = FaqApi;
