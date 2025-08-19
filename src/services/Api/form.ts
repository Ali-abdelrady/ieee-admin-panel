// src/services/Api/admin/events.ts

import { normalizeApiPayload } from "@/lib/nomrllizeFormResponse";
import { api } from "./api";
import {
  ApiEnvelope,
  NormalizedFormResponses,
  registrationAcceptResponse,
} from "@/types/forms";

export const EventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Event sponsors endpoints
    // addEventForm: builder.mutation<
    //   FormResponse,
    //   { data: FormRequest; eventId: string }
    // >({
    //   query: ({ data, eventId }) => ({
    //     url: `/admin/forms/`,
    //     method: "POST",
    //     body: { ...data, eventId },
    //     // formData: true,
    //   }),
    //   invalidatesTags: (result, error, arg) => [
    //     { type: "EventForms", id: arg.eventId },
    //     { type: "EventForms", id: "LIST" },
    //     { type: "Forms", id: "LIST" },
    //   ],
    // }),

    acceptEventRegistration: builder.mutation<
      registrationAcceptResponse,
      { formId: string; responseId: string; status: string }
    >({
      query: ({ responseId, status }) => ({
        url: `/admin/events/responses/${responseId}/accept-user`,
        method: "POST",
        body: { responseId, status },
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "FormResponses", id: "LIST" },
        { type: "FormResponses", id: arg.formId },
      ],
    }),

    getFormResponses: builder.query<NormalizedFormResponses, string>({
      query: (formId) => `/admin/forms/${formId}/responses/`,
      transformResponse: (response: ApiEnvelope) => normalizeApiPayload(response),
      providesTags: (result, error, formId) => {
        return [
          { type: "FormResponses" as const, id: formId },
          { type: "FormResponses" as const, id: "LIST" },
        ];
      },
    }),

    // deleteEventForm: builder.mutation<
    //   FormResponse,
    //   { formId: string; eventId: string }
    // >({
    //   query: ({ formId, eventId }) => ({
    //     url: `/admin/events/${eventId}/foms/${formId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: (result, error, arg) => [
    //     { type: "EventForms", id: arg.eventId },
    //     { type: "EventForms", id: "LIST" },
    //   ],
    // }),

    // updateEventForm: builder.mutation<
    //   FormResponse,
    //   { data: FormRequest; formId: string; eventId: string }
    // >({
    //   query: ({ data, formId, eventId }) => ({
    //     url: `/admin/forms/${formId}`,
    //     method: "PATCH",
    //     body: data,
    //     formData: true,
    //   }),
    //   invalidatesTags: (result, error, arg) => [
    //     // { type: "EventForms", id: arg.formId },
    //     { type: "EventForms", id: arg.eventId },
    //     { type: "EventForms", id: "LIST" },
    //   ],
    // }),
  }),
  overrideExisting: false,
});

export const {
  //   useAddEventFormMutation,
  useGetFormResponsesQuery,
  useAcceptEventRegistrationMutation,
  //   useDeleteEventFormMutation,
  //   useUpdateEventFormMutation,
} = EventApi;
