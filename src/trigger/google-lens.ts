import { task } from "@trigger.dev/sdk/v3";
import { getJson } from "serpapi";

export const googleLensSearch = task({
  id: "search-with-google-lens",
  maxDuration: 300,
  run: async (payload: any, { ctx }) => {
    const response = await getJson({
      engine: "google_lens",
      url: payload.imageUrl,
      type: payload.type || "all",
      safe: "off",
      api_key: process.env.SERP_API_KEY!,
    });

    return response;
  },
});
