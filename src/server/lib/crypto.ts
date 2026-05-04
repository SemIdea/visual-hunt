import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

export const HmacSha256 = (plainText: string, key: string): string => {
    const hmac = createHmac("sha256", key);
    hmac.update(plainText);
    return hmac.digest("hex");
};

export const AESEncrypt = (plainText: string, aesKey: string): string => {
    const key = Buffer.from(aesKey, "hex");
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

export const AESDecrypt = (packed: string, aesKey: string): string => {
    const parts = packed.split(":");
    if (parts.length !== 3) {
        throw new Error(`Invalid encrypted token format: expected 3 parts got ${parts.length}`);
    }
    const [ivHex, authTagHex, ciphertextHex] = parts;
    const key = Buffer.from(aesKey, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
