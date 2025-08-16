import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ensureCsrf, invalidateCsrf } from "../../lib/csrfClient";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`,
  credentials: "include",
  // RTK passes { type: 'query' | 'mutation' }
  prepareHeaders: async (headers, { type }) => {
    headers.set("Accept", "application/json");
    if (type === "mutation") {
      const token = await ensureCsrf(); // get/refresh token for writes
      headers.set("x-csrf-token", token);
    }
    return headers;
  },
});

// Retry once on CSRF failure
const baseQueryWithCsrf: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  let res = await rawBaseQuery(args, api, extra);
  if (res.error && res.error.status === 403) {
    // token likely missing/expired → refresh and retry once
    try {
      invalidateCsrf();
      await ensureCsrf();
      res = await rawBaseQuery(args, api, extra);
    } catch {
      // keep original error if refresh fails
    }
  }
  return res;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithCsrf,
  tagTypes: [
    "Login",
    "User",
    "Faqs",
    "Posts",
    "Boards",
    "Committees",
    "Awards",
    "Partners",
    "Forms",
    "EventForms",
    "Events",
    "FormResponses",
    "Speakers",
    "Sponsors",
    "Menus",
    "EventSpeakers",
    "Timelines",
    "EventSponsors",
    "EventMedia",
    "Members",
    "Seasons",
  ],
  endpoints: () => ({}),
});
