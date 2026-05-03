import { describe, expect, it, vi } from "vitest";

const mockTrigger = vi.fn();

vi.mock("@trigger.dev/sdk/v3", () => ({
    tasks: {
        trigger: mockTrigger,
    },
}));

describe("taskRegistry", () => {
    it("startSearch.trigger calls tasks.trigger with correct payload", async () => {
        const { taskRegistry } = await import("./tasks");

        await taskRegistry.startSearch.trigger({ imageUrl: "https://example.com/img.jpg" });

        expect(mockTrigger).toHaveBeenCalledWith("start-search", {
            imageUrl: "https://example.com/img.jpg",
        });
    });
});
