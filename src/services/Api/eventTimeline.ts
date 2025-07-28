import { api } from "./api";
import {
  TimelineType,
  TimelineRequest,
  TimelineResponse,
  AgendaItemType,
  AgendaItemRequest,
  AgendaItemResponse,
} from "@/types/eventTimeline";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Timeline CRUD endpoints
    addTimeline: builder.mutation<
      TimelineResponse,
      { data: TimelineRequest; eventId: string }
    >({
      query: ({ data, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: "LIST" },
      ],
    }),

    getTimelines: builder.query<TimelineResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/timeline/`,
      providesTags: (result, error, eventId) => {
        const data = result?.data?.timeline ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((t) => ({
              type: "Timelines" as const,
              id: t.id,
            })),
            { type: "Timelines" as const, id: eventId },
            { type: "Timelines" as const, id: "LIST" },
          ];
        }
        return [
          { type: "Timelines" as const, id: eventId },
          { type: "Timelines" as const, id: "LIST" },
        ];
      },
    }),

    deleteTimeline: builder.mutation<
      TimelineResponse,
      { timelineId: number; eventId: string }
    >({
      query: ({ timelineId, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/${timelineId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Timelines", id: arg.timelineId },
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: "LIST" },
      ],
    }),

    updateTimeline: builder.mutation<
      TimelineResponse,
      { data: TimelineRequest; timelineId: string; eventId: string }
    >({
      query: ({ data, timelineId, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/${timelineId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Timelines", id: arg.timelineId },
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: "LIST" },
      ],
    }),

    // Agenda Items CRUD endpoints
    addAgendaItem: builder.mutation<
      AgendaItemResponse,
      {
        data: AgendaItemRequest;
        eventId: string | number;
        timelineId: string | number;
      }
    >({
      query: ({ data, timelineId, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/${timelineId}/sessions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: "LIST" },
      ],
    }),

    deleteAgendaItem: builder.mutation<
      AgendaItemResponse,
      {
        // data: AgendaItemRequest;
        eventId: string | number;
        timelineId: string | number;
        agendaItemId: string | number;
      }
    >({
      query: ({ agendaItemId, timelineId, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/${timelineId}/sessions/${agendaItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: "LIST" },
      ],
    }),

    updateAgendaItem: builder.mutation<
      AgendaItemResponse,
      {
        data: AgendaItemRequest;
        eventId: string;
        timelineId: string;
        agendaItemId: string;
      }
    >({
      query: ({ data, agendaItemId, timelineId, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/${timelineId}/sessions/${agendaItemId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: arg.eventId },
        { type: "Timelines", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Timeline hooks
  useAddTimelineMutation,
  useGetTimelinesQuery,
  useDeleteTimelineMutation,
  useUpdateTimelineMutation,
  // Agenda Items hooks
  useAddAgendaItemMutation,
  useDeleteAgendaItemMutation,
  useUpdateAgendaItemMutation,
} = EventApi;
