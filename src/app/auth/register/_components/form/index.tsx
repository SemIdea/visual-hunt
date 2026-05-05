"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/lib/trpc/client";
import { useAuth } from "@/lib/auth/context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@/lib/auth/storage";

const RegisterForm = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const registerMutation = useMutation(
        trpc.auth.register.mutationOptions({
            onSuccess: (data) => {
                setAccessToken(data.result.accessToken);
                queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
                router.push("/");
            },
            onError: (err) => {
                if (err.data?.code === "CONFLICT") {
                    setError("An account with this email already exists.");
                } else {
                    setError(err.message);
                }
            },
        }),
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log(name, email, password);
        registerMutation.mutate({ name, email, password });
    };

    return (
        <>
            <CardDescription>Create your account to get started</CardDescription>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        maxLength={100}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        maxLength={128}
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? "Creating account..." : "Create account"}
                </Button>
            </form>
        </>
    );
};

export default RegisterForm;
