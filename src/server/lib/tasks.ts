import { tasks } from "@trigger.dev/sdk";

export const taskRegistry = {
    startSearch: {
        trigger(payload: { imageUrl: string; searchId: string }) {
            return tasks.trigger("start-search", payload);
        },
    },
} as const;
