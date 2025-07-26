import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import cookieService from "../cookies/cookieService";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  tagTypes: [
    "Login",
    "User",
    "Faqs",
    "Posts",
    "Boards",
    "Committees",
    "Awards",
    "Partners",
    "Events",
    "Speakers",
    "Sponsors",
    "Menus",
    "EventSpeakers",
  ],

  endpoints: () => ({}), // start empty
});
