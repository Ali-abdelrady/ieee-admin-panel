// src/services/Api/admin/menuApi.ts
import { api } from "./api";
import {
  FoodMenuType,
  FoodMenuRequest,
  FoodMenuResponse,
} from "@/types/foodMenu";

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query<FoodMenuResponse, string>({
      query: (eventId) => `/admin/events/${eventId}/restaurants`,
      providesTags: (result, error, eventId) => {
        const menus = result?.data?.menus ?? [];
        if (menus.length) {
          return [
            ...menus.map((menu) => ({
              type: "Menus" as const,
              id: menu.id,
            })),
            { type: "Menus" as const, id: `EVENT-${eventId}` },
            { type: "Menus" as const, id: "LIST" },
          ];
        }
        return [
          { type: "Menus" as const, id: `EVENT-${eventId}` },
          { type: "Menus" as const, id: "LIST" },
        ];
      },
    }),

    addMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; data: FoodMenuRequest }
    >({
      query: ({ eventId, data }) => ({
        url: `/admin/events/${eventId}/restaurants`,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Menus", id: `EVENT-${eventId}` },
        { type: "Menus", id: "LIST" },
      ],
    }),

    updateMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; menuId: string; data: FoodMenuType }
    >({
      query: ({ eventId, menuId, data }) => ({
        url: `/admin/events/${eventId}/restaurants/${menuId}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { eventId, menuId }) => [
        { type: "Menus", id: menuId },
        { type: "Menus", id: `EVENT-${eventId}` },
        { type: "Menus", id: "LIST" },
      ],
    }),

    deleteMenu: builder.mutation<
      FoodMenuResponse,
      { eventId: string; menuId: string | number }
    >({
      query: ({ eventId, menuId }) => ({
        url: `/admin/events/${eventId}/restaurants/${menuId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId, menuId }) => [
        { type: "Menus", id: menuId.toString() },
        { type: "Menus", id: `EVENT-${eventId}` },
        { type: "Menus", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMenusQuery,
  useAddMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menuApi;
