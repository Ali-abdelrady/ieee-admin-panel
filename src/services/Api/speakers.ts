// src/services/Api/speakers.ts
import { api } from "./api";
import {
  SpeakerRequest,
  SpeakerResponse,
  SpeakersResponse,
  SpeakerType,
} from "@/types/speakers";

export const SpeakerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpeakers: builder.query<SpeakersResponse, void>({
      query: () => "/admin/speakers",
      providesTags: (result) => {
        const data = result?.data?.speakers ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Speakers" as const,
              id: e.id,
            })),
            { type: "Speakers" as const, id: "LIST" },
          ];
        }
        return [{ type: "Speakers" as const, id: "LIST" }];
      },
    }),
    getSpeakerById: builder.query<SpeakerResponse, string>({
      query: (id) => `/admin/speakers/${id}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Speakers" as const, id: result?.data?.speaker?.id },
              { type: "Speakers" as const, id: "LIST" },
            ]
          : [{ type: "Speakers" as const, id: "LIST" }],
    }),
    addSpeaker: builder.mutation<SpeakerResponse, SpeakerRequest | FormData>({
      query: (data) => ({
        url: "/admin/speakers",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Speakers", id: "LIST" }],
    }),
    updateSpeaker: builder.mutation<SpeakerResponse, SpeakerType>({
      query: (data) => ({
        url: `/admin/speakers/${data.id}`,
        method: "PATCH",
        body: {
          ...data,
        },
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Speakers", id: arg.id },
        { type: "Speakers", id: "LIST" },
      ],
    }),
    deleteSpeaker: builder.mutation<SpeakerResponse, string | number>({
      query: (id) => ({
        url: `/admin/speakers/${id.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Speakers", id },
        { type: "Speakers", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddSpeakerMutation,
  useGetSpeakersQuery,
  useGetSpeakerByIdQuery,
  useUpdateSpeakerMutation,
  useDeleteSpeakerMutation,
} = SpeakerApi;
