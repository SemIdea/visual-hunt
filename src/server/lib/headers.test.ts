import { describe, expect, it } from "vitest";
import { extractBearerToken, parseHeaders } from "./headers";

describe("extractBearerToken", () => {
    it("returns token from Authorization Bearer header", () => {
        const headers = new Headers({ authorization: "Bearer mytoken123" });
        expect(extractBearerToken(headers)).toBe("mytoken123");
    });

    it("returns null when no Authorization header", () => {
        const headers = new Headers();
        expect(extractBearerToken(headers)).toBeNull();
    });

    it("returns token from auth cookie when Authorization header is missing", () => {
        const headers = new Headers({
            cookie: "other=value; vh_access_token=cookie_token_123",
        });
        expect(extractBearerToken(headers)).toBe("cookie_token_123");
    });

    it("prefers Authorization header over auth cookie", () => {
        const headers = new Headers({
            authorization: "Bearer header_token_123",
            cookie: "vh_access_token=cookie_token_123",
        });
        expect(extractBearerToken(headers)).toBe("header_token_123");
    });

    it("returns null when Authorization is not Bearer", () => {
        const headers = new Headers({ authorization: "Basic dXNlcjpwYXNz" });
        expect(extractBearerToken(headers)).toBeNull();
    });

    it("returns null when Bearer has no token", () => {
        const headers = new Headers({ authorization: "Bearer " });
        expect(extractBearerToken(headers)).toBeNull();
    });
});

describe("parseHeaders", () => {
    it("extracts IP from x-forwarded-for", () => {
        const headers = new Headers({
            "x-forwarded-for": "203.0.113.5, 10.0.0.1",
            "user-agent": "Mozilla/5.0",
        });
        const device = parseHeaders(headers);
        expect(device.ip).toBe("203.0.113.5");
    });

    it("falls back to cf-connecting-ip", () => {
        const headers = new Headers({
            "cf-connecting-ip": "198.51.100.2",
            "user-agent": "Mozilla/5.0",
        });
        const device = parseHeaders(headers);
        expect(device.ip).toBe("198.51.100.2");
    });

    it("falls back to 127.0.0.1 when no IP headers", () => {
        const headers = new Headers({ "user-agent": "Mozilla/5.0" });
        const device = parseHeaders(headers);
        expect(device.ip).toBe("127.0.0.1");
    });

    it("parses user-agent browser", () => {
        const headers = new Headers({
            "user-agent": "Chrome/120.0.0.0",
        });
        const device = parseHeaders(headers);
        expect(device.userAgent.browser).toBe("Chrome");
    });

    it("throws BAD_REQUEST on missing user-agent", () => {
        const headers = new Headers();
        expect(() => parseHeaders(headers)).toThrow("Missing user-agent header");
    });
});
