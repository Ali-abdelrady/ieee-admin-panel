import { api } from "./api";
import {
  SeasonRequest,
  SeasonResponse,
  SeasonsResponse,
  SeasonType,
} from "@/types/season";

export const SeasonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET all seasons
    getSeasons: builder.query<SeasonsResponse, void>({
      query: () => "/admin/seasons",
      providesTags: (result) => {
        const data = result?.data?.seasons ?? [];
        if (Array.isArray(data) && data.length) {
          return [
            ...data.map((e) => ({
              type: "Seasons" as const,
              id: e.id,
            })),
            { type: "Seasons", id: "LIST" },
          ];
        }
        return [{ type: "Seasons", id: "LIST" }];
      },
    }),

    // GET single season by ID
    getSeasonById: builder.query<SeasonResponse, string | number>({
      query: (id) => `/admin/seasons/${id}`,
      providesTags: (result) =>
        result?.data?.seasons
          ? [
              { type: "Seasons" as const, id: result.data.seasons.id },
              { type: "Seasons", id: "LIST" },
            ]
          : [{ type: "Seasons", id: "LIST" }],
    }),

    // CREATE new season
    addSeason: builder.mutation<SeasonResponse, SeasonRequest>({
      query: (data) => ({
        url: "/admin/admin/seasons",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [{ type: "Seasons", id: "LIST" }],
    }),

    // UPDATE season
    updateSeason: builder.mutation<SeasonResponse, SeasonType>({
      query: (data) => ({
        url: `/admin/admin/seasons/${data.id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Seasons", id: arg.id },
        { type: "Seasons", id: "LIST" },
      ],
    }),

    // DELETE season
    deleteSeason: builder.mutation<SeasonResponse, string | number>({
      query: (id) => ({
        url: `/admin/admin/seasons/${id.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Seasons", id },
        { type: "Seasons", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSeasonsQuery,
  useGetSeasonByIdQuery,
  useAddSeasonMutation,
  useUpdateSeasonMutation,
  useDeleteSeasonMutation,
} = SeasonApi;
