import { auth, tasks } from "@trigger.dev/sdk";

export const taskRegistry = {
    createPublicToken(runId: string) {
        return auth.createPublicToken({
            scopes: {
                read: {
                    runs: runId,
                },
            },
        });
    },
    startSearch: {
        trigger(payload: { imageUrl: string; searchId: string }) {
            return tasks.trigger("start-search", payload);
        },
    },
} as const;
