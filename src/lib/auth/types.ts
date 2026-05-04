export interface AuthUser {
    id: string;
    name: string;
    email: string;
    image: string;
    stripeCustomerId: string | null;
    subscription: {
        stripePriceId: string;
        status: string;
        currentPeriodEnd: string;
    } | null;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    accessToken: string | null;
}
