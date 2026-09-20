import { type NextRequest, NextResponse } from "next/server";

/**
 * Portfolio lockdown: when PORTFOLIO_LOCKDOWN=true, the deployment serves
 * only the marketing home page. Every other route (auth, dashboard, pricing,
 * search, and all of /api — including the Stripe checkout procedure) is
 * blocked, so a visitor can read the code on GitHub but cannot sign up,
 * check out, or reach any state-changing endpoint.
 */
export function middleware(request: NextRequest) {
    if (process.env.PORTFOLIO_LOCKDOWN !== "true") {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        return NextResponse.next();
    }

    if (pathname.startsWith("/api")) {
        return NextResponse.json(
            { error: "Portfolio deployment: the live API is disabled." },
            { status: 404 },
        );
    }

    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
