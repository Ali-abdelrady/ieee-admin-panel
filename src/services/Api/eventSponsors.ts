// src/services/Api/admin/events.ts
import {
  EventSponsorRequest,
  EventSponsorResponse,
} from "@/types/eventSponsors";
import { api } from "./api";
import { SponsorRequest, SponsorsResponse } from "@/types/sponsors";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Add event sponsor
    addEventSponsor: builder.mutation<
      EventSponsorResponse,
      { data: EventSponsorRequest; eventId: string }
    >({
      query: ({ data, eventId }) => ({
        url: `/admin/events/${eventId}/sponsors/`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "EventSponsors", id: `EVENT-${eventId}` },
        { type: "Sponsors", id: "LIST" }, // refresh sponsors list if needed
      ],
    }),

    // Get all sponsors for an event
    getEventSponsors: builder.query<EventSponsorResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/sponsors/`,
      providesTags: (result, error, eventId) => {
        const sponsors = result?.data ?? [];
        if (Array.isArray(sponsors) && sponsors.length) {
          return [
            ...sponsors.map((s) => ({
              type: "EventSponsors" as const,
              id: s.id,
            })),
            { type: "EventSponsors" as const, id: `EVENT-${eventId}` },
          ];
        }
        return [{ type: "EventSponsors", id: `EVENT-${eventId}` }];
      },
    }),

    // Delete sponsor from event
    deleteEventSponsor: builder.mutation<
      EventSponsorResponse,
      { sponsorId: string; eventId: string }
    >({
      query: ({ sponsorId, eventId }) => ({
        url: `/admin/events/${eventId}/sponsors/${sponsorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { sponsorId, eventId }) => [
        { type: "EventSponsors", id: sponsorId },
        { type: "EventSponsors", id: `EVENT-${eventId}` },
      ],
    }),

    // Update sponsor in event
    updateEventSponsor: builder.mutation<
      SponsorsResponse,
      { data: SponsorRequest; sponsorId: string; eventId: string }
    >({
      query: ({ data, sponsorId, eventId }) => ({
        url: `/admin/events/${eventId}/sponsors/${sponsorId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { sponsorId, eventId }) => [
        { type: "EventSponsors", id: sponsorId },
        { type: "EventSponsors", id: `EVENT-${eventId}` },
      ],
    }),
  }),
});

export const {
  useAddEventSponsorMutation,
  useGetEventSponsorsQuery,
  useDeleteEventSponsorMutation,
  useUpdateEventSponsorMutation,
} = EventApi;
