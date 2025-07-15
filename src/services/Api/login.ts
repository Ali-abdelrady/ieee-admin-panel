// Need to use the React-specific entry point to import createApi

import { LoginRequest, LoginResponse } from "@/types";
import cookieService from "../cookies/cookieService";
import { api } from "./api";
import { logout } from "../store/features/AuthSlice";

// Define a service using a base URL and expected endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => {
        return {
          url: "/login",
          method: "POST",
          body: {
            ...data,
          },
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLogoutMutation } = authApi;
