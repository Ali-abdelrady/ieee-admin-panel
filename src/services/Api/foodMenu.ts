// api/menuApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FoodMenuType,
  FoodMenuRequest,
  FoodMenuResponse,
  FoodMenusResponse,
} from "@/types/foodMenu";
import { api } from "./api";

export const MenuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query<FoodMenusResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/food-menu`,
      providesTags: (result, error, eventId) => {
        const data = result?.data?.menus ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Menus" as const,
              id: e.id,
            })),
            { type: "Menus" as const, id: "LIST" },
            { type: "Menus" as const, id: `EVENT-${eventId}` },
          ];
        }
        return [
          { type: "Menus" as const, id: "LIST" },
          { type: "Menus" as const, id: `EVENT-${eventId}` },
        ];
      },
    }),
    getMenuById: builder.query<
      FoodMenuResponse,
      { eventId: string; menuId: string | number }
    >({
      query: ({ eventId, menuId }) =>
        `/admin/events/${eventId}/food-menu/${menuId}`,
      providesTags: (result, error, { eventId, menuId }) =>
        result
          ? [
              { type: "Menus" as const, id: result?.data?.menus?.id },
              { type: "Menus" as const, id: "LIST" },
              { type: "Menus" as const, id: `EVENT-${eventId}` },
            ]
          : [
              { type: "Menus" as const, id: "LIST" },
              { type: "Menus" as const, id: `EVENT-${eventId}` },
            ],
    }),
    addMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; data: FoodMenuRequest }
    >({
      query: ({ eventId, data }) => ({
        
        url: `/admin/events/${eventId}/food-menu`,
        method: "POST",
        body: { ...data, items: [] },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: `EVENT-${eventId}` },
      ],
    }),
    updateMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; data: FoodMenuType }
    >({
      query: ({ eventId, data }) => ({
        url: `/admin/events/${eventId}/food-menu/${data.id}`,
        method: "PATCH",
        body: { ...data, items: [] },
      }),
      invalidatesTags: (result, error, { eventId, data }) => [
        { type: "Menus", id: data.id },
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: `EVENT-${eventId}` },
      ],
    }),
    deleteMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; menuId: string | number }
    >({
      query: ({ eventId, menuId }) => ({
        url: `/admin/events/${eventId}/food-menu/${menuId.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId, menuId }) => [
        { type: "Menus", id: menuId },
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: `EVENT-${eventId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useAddMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = MenuApi;
