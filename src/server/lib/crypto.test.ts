import { describe, expect, it } from "vitest";
import { AESDecrypt, AESEncrypt, HmacSha256 } from "./crypto";

describe("HmacSha256", () => {
    it("returns known hex digest", () => {
        const result = HmacSha256("hello", "key");
        expect(result).toBe("9307b3b915efb5171ff14d8cb55fbcc798c6c0ef1456d66ded1a6aa723a58b7b");
    });

    it("returns different digest for different keys", () => {
        const a = HmacSha256("hello", "key1");
        const b = HmacSha256("hello", "key2");
        expect(a).not.toBe(b);
    });
});

describe("AESEncrypt / AESDecrypt", () => {
    const aesKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    it("roundtrips plaintext", () => {
        const plaintext = "secret data";
        const encrypted = AESEncrypt(plaintext, aesKey);
        const decrypted = AESDecrypt(encrypted, aesKey);
        expect(decrypted).toBe(plaintext);
    });

    it("produces different ciphertext each time (random IV)", () => {
        const plaintext = "same data";
        const a = AESEncrypt(plaintext, aesKey);
        const b = AESEncrypt(plaintext, aesKey);
        expect(a).not.toBe(b);
    });
});

describe("AESDecrypt", () => {
    it("throws on malformed input", () => {
        expect(() =>
            AESDecrypt(
                "tooshort",
                "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            ),
        ).toThrow("Invalid encrypted token format");
    });
});
