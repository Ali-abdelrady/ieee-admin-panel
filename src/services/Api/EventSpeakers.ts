// src/services/Api/admin/events.ts
import {
  EventSpeakerRequest,
  EventSpeakerResponse,
  EventSpeakerType,
} from "@/types/EventSpeakers";
import { api } from "./api";
import { EventResponse } from "@/types/events";
import { SpeakerRequest, SpeakerResponse } from "@/types/speakers";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Event Speakers endpoints
    addEventSpeaker: builder.mutation<
      EventSpeakerResponse,
      { data: EventSpeakerRequest; eventId: string }
    >({
      query: ({ data, eventId }) => ({
        url: `/admin/events/${eventId}/speakers/`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EventSpeakers", id: arg.eventId },
        { type: "EventSpeakers", id: "LIST" },
      ],
    }),

    getEventSpeakers: builder.query<EventSpeakerResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/speakers/`,
      providesTags: (result, error, eventId) => {
        const data = result?.data ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "EventSpeakers" as const,
              id: e.id,
            })),
            { type: "EventSpeakers" as const, id: eventId },
            { type: "EventSpeakers" as const, id: "LIST" },
          ];
        }
        return [
          { type: "EventSpeakers" as const, id: eventId },
          { type: "EventSpeakers" as const, id: "LIST" },
        ];
      },
    }),

    deleteEventSpeaker: builder.mutation<
      EventSpeakerResponse,
      { speakerId: string; eventId: string }
    >({
      query: ({ speakerId, eventId }) => ({
        url: `/admin/events/${eventId}/speakers/${speakerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EventSpeakers", id: arg.speakerId },
        { type: "EventSpeakers", id: arg.eventId },
        { type: "EventSpeakers", id: "LIST" },
      ],
    }),

    updateEventSpeaker: builder.mutation<
      SpeakerResponse,
      { data: SpeakerRequest; speakerId: string; eventId: string }
    >({
      query: ({ data, speakerId, eventId }) => ({
        url: `/admin/events/${eventId}/speakers/${speakerId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EventSpeakers", id: arg.speakerId },
        { type: "EventSpeakers", id: arg.eventId },
        { type: "EventSpeakers", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddEventSpeakerMutation,
  useGetEventSpeakersQuery,
  useDeleteEventSpeakerMutation,
  useUpdateEventSpeakerMutation,
} = EventApi;
