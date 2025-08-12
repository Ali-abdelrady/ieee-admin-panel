// src/services/Api/admin/events.ts
import {
  EventSpeakerRequest,
  EventSpeakerResponse,
} from "@/types/EventSpeakers";
import { api } from "./api";
import { SpeakerRequest, SpeakerResponse } from "@/types/speakers";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Add event speaker
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
      invalidatesTags: (result, error, { eventId }) => [
        { type: "EventSpeakers", id: `EVENT-${eventId}` },
      ],
    }),

    // Get all speakers for an event
    getEventSpeakers: builder.query<EventSpeakerResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/speakers/`,
      providesTags: (result, error, eventId) => {
        const speakers = result?.data ?? [];
        if (Array.isArray(speakers) && speakers.length) {
          return [
            ...speakers.map((s) => ({
              type: "EventSpeakers" as const,
              id: s.id,
            })),
            { type: "EventSpeakers" as const, id: `EVENT-${eventId}` },
          ];
        }
        return [{ type: "EventSpeakers", id: `EVENT-${eventId}` }];
      },
    }),

    // Delete a speaker from an event
    deleteEventSpeaker: builder.mutation<
      EventSpeakerResponse,
      { speakerId: string; eventId: string }
    >({
      query: ({ speakerId, eventId }) => ({
        url: `/admin/events/${eventId}/speakers/${speakerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { speakerId, eventId }) => [
        { type: "EventSpeakers", id: speakerId },
        { type: "EventSpeakers", id: `EVENT-${eventId}` },
      ],
    }),

    // Update a speaker in an event
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
      invalidatesTags: (result, error, { speakerId, eventId }) => [
        { type: "EventSpeakers", id: speakerId },
        { type: "EventSpeakers", id: `EVENT-${eventId}` },
      ],
    }),
  }),
});

export const {
  useAddEventSpeakerMutation,
  useGetEventSpeakersQuery,
  useDeleteEventSpeakerMutation,
  useUpdateEventSpeakerMutation,
} = EventApi;
