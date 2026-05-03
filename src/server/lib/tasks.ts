import { tasks } from "@trigger.dev/sdk/v3";

export const taskRegistry = {
    startSearch: {
        trigger(payload: { imageUrl: string }) {
            return tasks.trigger("start-search", payload);
        },
    },
} as const;
