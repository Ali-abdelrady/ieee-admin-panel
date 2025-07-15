// src/services/Api/admin/events.ts
import { api } from "./api";
import {
  EventDetailsType,
  EventRequest,
  EventResponse,
  EventsResponse,
  EventType,
} from "@/types/events";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, void>({
      query: () => "/admin/events",
      providesTags: (result) => {
        const data = result?.data?.events ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Events" as const,
              id: e.id,
            })),
            { type: "Events" as const, id: "LIST" },
          ];
        }
        return [{ type: "Events" as const, id: "LIST" }];
      },
    }),
    getEventById: builder.query<EventResponse, string>({
      query: (id) => `/admin/events/${id}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Events" as const, id: result?.data?.events?.id },
              { type: "Events" as const, id: "LIST" },
            ]
          : [{ type: "Events" as const, id: "LIST" }],
    }),
    addEvent: builder.mutation<EventResponse, EventRequest>({
      query: (data) => ({
        url: "/admin/events",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),
    updateEvent: builder.mutation<EventResponse, EventType>({
      query: (data) => ({
        url: `/admin/events/${data.id}`,
        method: "PATCH",
        body: {
          ...data,
        },
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Events", id: arg.id },
        { type: "Events", id: "LIST" },
      ],
    }),
    deleteEvent: builder.mutation<EventResponse, string | number>({
      query: (id) => ({
        url: `/admin/events/${id.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Events", id },
        { type: "Events", id: "LIST" },
      ],
    }),
    addEventDetails: builder.mutation<EventResponse, EventDetailsType>({
      query: (data) => ({
        url: `/admin/events/${data.id}/essentials`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddEventMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useAddEventDetailsMutation,
} = EventApi;
