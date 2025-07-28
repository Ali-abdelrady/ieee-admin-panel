// src/services/Api/admin/events.ts
import {
  EventSponsorRequest,
  EventSponsorResponse,
} from "@/types/eventSponsors";
import { api } from "./api";
import { SponsorRequest, SponsorsResponse } from "@/types/sponsors";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Event sponsors endpoints
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
      invalidatesTags: (result, error, arg) => [
        { type: "EventSponsors", id: arg.eventId },
        { type: "EventSponsors", id: "LIST" },
        { type: "Sponsors", id: "LIST" },
      ],
    }),

    getEventSponsors: builder.query<EventSponsorResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/sponsors/`,
      providesTags: (result, error, eventId) => {
        const data = result?.data ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "EventSponsors" as const,
              id: e.id,
            })),
            { type: "EventSponsors" as const, id: eventId },
            { type: "EventSponsors" as const, id: "LIST" },
          ];
        }
        return [
          { type: "EventSponsors" as const, id: eventId },
          { type: "EventSponsors" as const, id: "LIST" },
        ];
      },
    }),

    deleteEventSponsor: builder.mutation<
      EventSponsorResponse,
      { sponsorId: string; eventId: string }
    >({
      query: ({ sponsorId, eventId }) => ({
        url: `/admin/events/${eventId}/sponsors/${sponsorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        // { type: "EventSponsors", id: arg.sponsorId },
        { type: "EventSponsors", id: arg.eventId },
        { type: "EventSponsors", id: "LIST" },
      ],
    }),

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
      invalidatesTags: (result, error, arg) => [
        // { type: "EventSponsors", id: arg.sponsorId },
        { type: "EventSponsors", id: arg.eventId },
        { type: "EventSponsors", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddEventSponsorMutation,
  useGetEventSponsorsQuery,
  useDeleteEventSponsorMutation,
  useUpdateEventSponsorMutation,
} = EventApi;
