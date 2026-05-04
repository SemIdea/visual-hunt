"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { getAccessToken, removeAccessToken, setAccessToken } from "./storage";
import type { AuthState } from "./types";

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const loginMutation = useMutation(
        trpc.auth.login.mutationOptions({
            onSuccess: (data) => {
                setAccessToken(data.result.accessToken);
            },
        }),
    );

    const token = getAccessToken();

    const meQuery = useQuery(
        trpc.auth.me.queryOptions(undefined, {
            enabled: !!token,
            retry: false,
            staleTime: 5 * 60 * 1000,
        }),
    );

    const user = meQuery.data?.result ?? null;

    const login = useCallback(
        async (email: string, password: string) => {
            await loginMutation.mutateAsync({ email, password });
            await queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
        },
        [loginMutation, queryClient, trpc.auth.me],
    );

    const logoutMutation = useMutation(
        trpc.auth.logout.mutationOptions({
            onSuccess: () => {
                removeAccessToken();
                queryClient.clear();
            },
        }),
    );

    const logout = useCallback(async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch {
            removeAccessToken();
            queryClient.clear();
        }
    }, [logoutMutation, queryClient]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!token && !!user,
            accessToken: token,
            login,
            logout,
            isLoading: loginMutation.isPending || meQuery.isLoading,
        }),
        [user, token, login, logout, loginMutation.isPending, meQuery.isLoading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
