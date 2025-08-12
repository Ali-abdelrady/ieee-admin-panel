// src/services/Api/admin/eventTimeline.ts
import { api } from "./api";
import {
  TimelineRequest,
  TimelineResponse,
  AgendaItemRequest,
  AgendaItemResponse,
} from "@/types/eventTimeline";

export const eventTimelineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** ─────────────────────────────
     *  TIMELINE CRUD
     *  ───────────────────────────── */
    addTimeline: builder.mutation<
      TimelineResponse,
      { data: TimelineRequest; eventId: string }
    >({
      query: ({ data, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Timelines", id: `EVENT-${eventId}` },
      ],
    }),

    getTimelines: builder.query<TimelineResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/timeline/`,
      providesTags: (result, error, eventId) => {
        const timelines = result?.data?.timeline ?? [];
        return [
          ...timelines.map((t) => ({
            type: "Timelines" as const,
            id: t.id,
          })),
          { type: "Timelines", id: `EVENT-${eventId}` },
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
      invalidatesTags: (result, error, { timelineId, eventId }) => [
        { type: "Timelines", id: timelineId },
        { type: "Timelines", id: `EVENT-${eventId}` },
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
      invalidatesTags: (result, error, { timelineId, eventId }) => [
        { type: "Timelines", id: timelineId },
        { type: "Timelines", id: `EVENT-${eventId}` },
      ],
    }),

    /** ─────────────────────────────
     *  AGENDA ITEMS CRUD
     *  ───────────────────────────── */
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
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Timelines", id: `EVENT-${eventId}` },
      ],
    }),

    deleteAgendaItem: builder.mutation<
      AgendaItemResponse,
      {
        eventId: string | number;
        timelineId: string | number;
        agendaItemId: string | number;
      }
    >({
      query: ({ agendaItemId, timelineId, eventId }) => ({
        url: `/admin/events/${eventId}/timeline/${timelineId}/sessions/${agendaItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Timelines", id: `EVENT-${eventId}` },
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
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Timelines", id: `EVENT-${eventId}` },
      ],
    }),
  }),
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
} = eventTimelineApi;
