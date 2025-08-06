// src/services/Api/admin/events.ts

import { api } from "./api";
import { FormRequest, FormResponse, FormResponses } from "@/types/forms";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Event sponsors endpoints
    addEventForm: builder.mutation<FormResponse, { data: FormRequest; eventId: string }>({
      query: ({ data, eventId }) => ({
        url: `/admin/forms/`,
        method: "POST",
        body: { ...data, eventId },
        // formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EventForms", id: arg.eventId },
        { type: "EventForms", id: "LIST" },
        { type: "Forms", id: "LIST" },
      ],
    }),

    getEventForms: builder.query<FormResponses, string>({
      query: (eventId) => `/admin/events/${eventId}/forms/`,
      providesTags: (result, error, eventId) => {
        const data = result?.data?.forms ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "EventForms" as const,
              id: e.id,
            })),
            { type: "EventForms" as const, id: eventId },
            { type: "EventForms" as const, id: "LIST" },
          ];
        }
        return [
          { type: "EventForms" as const, id: eventId },
          { type: "EventForms" as const, id: "LIST" },
        ];
      },
    }),

    deleteEventForm: builder.mutation<FormResponse, { formId: string; eventId: string }>({
      query: ({ formId, eventId }) => ({
        url: `/admin/events/${eventId}/foms/${formId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EventForms", id: arg.eventId },
        { type: "EventForms", id: "LIST" },
      ],
    }),

    updateEventForm: builder.mutation<
      FormResponse,
      { data: FormRequest; formId: string; eventId: string }
    >({
      query: ({ data, formId, eventId }) => ({
        url: `/admin/events/${eventId}/forms/${formId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        // { type: "EventForms", id: arg.formId },
        { type: "EventForms", id: arg.eventId },
        { type: "EventForms", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddEventFormMutation,
  useGetEventFormsQuery,
  useDeleteEventFormMutation,
  useUpdateEventFormMutation,
} = EventApi;
