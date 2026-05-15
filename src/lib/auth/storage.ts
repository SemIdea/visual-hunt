import { ACCESS_TOKEN_COOKIE_NAME } from "./constants";

export const getAccessToken = (): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${ACCESS_TOKEN_COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
};

export const setAccessToken = (token: string): void => {
    if (typeof document === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}; Max-Age=${60 * 60 * 24 * 30}`;
};

export const removeAccessToken = (): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`;
};
