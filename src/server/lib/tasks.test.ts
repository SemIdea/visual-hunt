import { describe, expect, it, vi } from "vitest";

const mockTrigger = vi.fn();

vi.mock("@trigger.dev/sdk", () => ({
    auth: {
        createPublicToken: vi.fn().mockResolvedValue("public_token"),
    },
    tasks: {
        trigger: mockTrigger,
    },
}));

describe("taskRegistry", () => {
    it("startSearch.trigger calls tasks.trigger with correct payload", async () => {
        const { taskRegistry } = await import("./tasks");

        await taskRegistry.startSearch.trigger({
            imageUrl: "https://example.com/img.jpg",
            searchId: "search_1",
        });

        expect(mockTrigger).toHaveBeenCalledWith("start-search", {
            imageUrl: "https://example.com/img.jpg",
            searchId: "search_1",
        });
    });

    it("createPublicToken scopes token to a run", async () => {
        const { auth } = await import("@trigger.dev/sdk");
        const { taskRegistry } = await import("./tasks");

        const token = await taskRegistry.createPublicToken("run_1");

        expect(token).toBe("public_token");
        expect(auth.createPublicToken).toHaveBeenCalledWith({
            scopes: {
                read: {
                    runs: "run_1",
                },
            },
        });
    });
});
