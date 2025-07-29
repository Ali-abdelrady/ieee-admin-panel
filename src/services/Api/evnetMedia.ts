import { api } from "./api";
import { EventMediaRequest, EventMediaResponse } from "@/types/eventMedia";

export const EventMediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadEventMedia: builder.mutation<
      EventMediaResponse,
      { data: EventMediaRequest; eventId: string }
    >({
      query: ({ data, eventId }) => {
        // const formData = new FormData();
        // const media = Array.isArray(data.media) ? data.media : [data.media];
        // media.forEach((file) => formData.append("media", file));

        return {
          url: `/admin/events/${eventId}/media/`,
          method: "POST",
          body: data,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { eventId }) => [
        { type: "EventMedia", id: eventId },
        { type: "EventMedia", id: "LIST" },
      ],
    }),

    getEventMedia: builder.query<EventMediaResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/media/`,
      providesTags: (result, error, eventId) => [
        { type: "EventMedia", id: eventId },
        { type: "EventMedia", id: "LIST" },
      ],
    }),

    deleteEventMedia: builder.mutation<
      EventMediaResponse,
      { mediaId: string; eventId: string }
    >({
      query: ({ mediaId, eventId }) => ({
        url: `/admin/events/${eventId}/media/${mediaId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId, mediaId }) => [
        { type: "EventMedia", id: eventId },
        { type: "EventMedia", id: mediaId },
        { type: "EventMedia", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadEventMediaMutation,
  useGetEventMediaQuery,
  useDeleteEventMediaMutation,
} = EventMediaApi;
