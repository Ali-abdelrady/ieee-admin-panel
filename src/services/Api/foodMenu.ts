// api/menuApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FoodMenuType,
  FoodMenuRequest,
  FoodMenuResponse,
} from "@/types/foodMenu";
import { api } from "./api";

export const MenuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query<FoodMenuResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/food-menus`,
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
    addMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; data: FoodMenuRequest }
    >({
      query: ({ eventId, data }) => ({
        url: `/admin/events/${eventId}/food-menus`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: `EVENT-${eventId}` },
      ],
    }),
    updateMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; data: FoodMenuType; menuId: string }
    >({
      query: ({ eventId, menuId, data }) => ({
        url: `/admin/events/${eventId}/food-menus/${menuId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { eventId, data, menuId }) => [
        { type: "Menus", id: menuId.toString() },
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: `EVENT-${eventId}` },
      ],
    }),
    deleteMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; menuId: string | number }
    >({
      query: ({ eventId, menuId }) => ({
        url: `/admin/events/${eventId}/food-menus/${menuId.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId, menuId }) => [
        { type: "Menus", id: menuId.toString() },
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: `EVENT-${eventId}` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMenusQuery,
  useAddMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = MenuApi;
