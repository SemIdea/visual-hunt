# DD-001: Visual Hunt Production Refactor — Design Document

**Status:** DRAFT
**RFC:** RFC-001
**Date:** 2026-04-12

---

## 1. Target Architecture

### Current Structure

```
src/server/
├── container/          # DI container (helpers, repositories)
├── drivers/            # Prisma, Redis clients
├── entities/           # BaseEntity + 7 entity classes
│   ├── base/           #   Generic base with 4 type params
│   ├── account/        #   DTO, entity, repositories/prisma
│   ├── result/         #   DTO, entity, repositories/prisma
│   ├── search/         #   DTO, entity, repositories/prisma
│   ├── session/        #   DTO, entity, repositories/prisma
│   ├── subscription/   #   DTO, entity, repositories/prisma
│   └── user/           #   DTO, entity, repositories/prisma
├── features/           # Use cases
│   ├── checkoutSession/
│   └── search/
├── integrations/       # Adapters (cache, uid)
├── routes/             # tRPC route definitions
├── schema/             # Zod input schemas
├── createContex.ts     # Static context (no request)
├── createRouter.ts     # tRPC init + procedures
└── caller.ts           # Server-side caller
```

### Target Structure (Neo-Console Pattern)

```
src/server/
├── root.ts                    # tRPC init, context, procedures (public + authenticated)
├── index.ts                   # Root router + OpenAPI document
├── features/
│   ├── auth/
│   │   ├── router.ts          # Route registration
│   │   ├── schemas.ts         # All input + output zod schemas
│   │   ├── procedures/        # Thin I/O layer (validate → call domain → format)
│   │   │   ├── login.ts
│   │   │   ├── logout.ts
│   │   │   └── ...
│   │   └── domains/           # Business logic (pure functions)
│   │       ├── create-session.ts
│   │       ├── revoke-session.ts
│   │       └── ...
│   ├── search/
│   │   ├── router.ts
│   │   ├── schemas.ts
│   │   ├── procedures/
│   │   │   ├── search-with-url.ts
│   │   │   ├── read-search.ts
│   │   │   ├── read-search-history.ts
│   │   │   ├── read-search-with-results.ts
│   │   │   └── delete-search.ts
│   │   └── domains/
│   │       ├── search-with-url.ts
│   │       ├── read-search.ts
│   │       ├── read-search-history.ts
│   │       └── delete-search.ts
│   ├── billing/
│   │   ├── router.ts
│   │   ├── schemas.ts
│   │   ├── procedures/
│   │   │   └── create-checkout-session.ts
│   │   └── domains/
│   │       └── create-checkout-session.ts
│   └── webhook/
│       ├── schemas.ts
│       └── domains/
│           ├── handle-stripe-webhook.ts
│           ├── sync-subscription.ts
│           └── handle-checkout-completed.ts
├── (removed: entities/, container/, integrations/, routes/, schema/)
src/lib/
├── env.ts                     # Centralized env config
├── prisma.ts                  # Singleton PrismaClient
├── redis.ts                   # Singleton Redis client
├── crypto.ts                  # HMAC-SHA256, AES-256-GCM
├── token.ts                   # Token generation + hashing
├── rate-limit/
│   └── rate-limit.ts          # Token-bucket Lua script
├── trpc/
│   ├── shared.ts              # QueryClient factory
│   ├── client.tsx             # React provider
│   └── server.ts              # Server-side proxy
├── stripe.ts                  # Stripe client singleton
├── trigger.ts                 # Trigger.dev context
└── utils.ts                   # Existing utility
```

---

## 2. Phase 1: Architecture Refactor

### 2.1 Centralized Context

**Current:** Static context with DI container. No request data.

**Target:** Request-scoped context with device info, session, and DB/Redis access.

```ts
// src/server/root.ts

export const createTRPCContext = async (opts: { headers: Headers }): Promise<TRPCContext> => {
    const device = parseHeaders(opts.headers);
    const accessToken = extractBearerToken(opts.headers);

    return {
        db: prismaClient,
        redis: redisClient,
        env,
        device,
        accessToken,
    };
};

export interface TRPCContext {
    db: typeof prismaClient;
    redis: typeof redisClient;
    env: typeof env;
    device: Device;
    accessToken: string | null;
}
```

### 2.2 Procedure → Domain Separation

**Rule:** Procedures do I/O (validate input, call domain, format output). Domains do business logic (pure functions, no HTTP awareness).

**Procedure example:**
```ts
// src/server/features/search/procedures/search-with-url.ts

export const procedure_searchWithUrl = protectedProcedure
    .input(searchWithUrlSchema)
    .output(searchWithUrlResultSchema)
    .meta({ rateLimit: { burst: { limit: 3, windowMs: ms("1m") } } })
    .mutation(async ({ ctx, input }) => {
        const result = await domain_searchWithUrl({
            ctx,
            params: { url: input.url, userId: ctx.session.user.id },
        });

        return { result: { id: result.id, status: result.status, jobId: result.jobId } };
    });
```

**Domain example:**
```ts
// src/server/features/search/domains/search-with-url.ts

export const domain_searchWithUrl = async ({
    ctx,
    params,
}: DomainInput<{ url: string; userId: string }>) => {
    const searchId = randomUUID();
    const job = await tasks.trigger("serp-google-lens", {
        searchId,
        imageUrl: params.url,
        type: "exact_matches",
    });

    const publicAccessToken = await auth.createPublicToken({
        scopes: { read: { runs: job.id } },
    });

    const search = await ctx.db.search.create({
        data: {
            id: searchId,
            userId: params.userId,
            source: params.url,
            status: "PENDING",
            jobId: job.id,
            publicAccessToken,
        },
    });

    return search;
};
```

### 2.3 Output Validation Schemas

Every procedure must declare `.output()`. Schemas strip sensitive fields.

```ts
// src/server/features/search/schemas.ts

export const searchResultSchema = z.object({
    id: z.uuid(),
    status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "EMPTY"]),
    source: z.string(),
    createdAt: z.date(),
});

export const searchWithUrlResultSchema = z.object({
    result: searchResultSchema,
});

// Read search with results — separate schema, no sensitive fields
export const searchWithResultsResultSchema = z.object({
    result: searchResultSchema.extend({
        results: z.array(resultItemSchema),
    }),
});
```

**Fields explicitly excluded from output:** `userId`, `jobId`, `publicAccessToken`, `stripeCustomerId`, `access_token`, `token_type`, `scope`.

### 2.4 PrismaClient Singleton

**Current:** 4 instances.

**Target:** One global singleton with dev hot-reload guard.

```ts
// src/lib/prisma.ts

import { PrismaClient } from "../generated/prisma/client";
import env from "./env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        // Use direct connection if not using Accelerate
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const prismaClient = prisma;
```

Trigger.dev tasks must receive `prismaClient` via context, not create their own instance.

### 2.5 Centralized Env Config

```ts
// src/lib/env.ts

import ms, { type StringValue } from "ms";

export default {
    publicUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    database: {
        redis: { url: process.env.REDIS_URL || "" },
        postgres: { url: process.env.DATABASE_URL || "" },
    },
    auth: {
        nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
        nextAuthUrl: process.env.NEXTAUTH_URL || "",
        github: {
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        },
        google: {
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        },
        session: {
            cacheTtl: ms((process.env.AUTH_SESSION_CACHE_TTL || "15m") as StringValue),
        },
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || "",
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    },
    cloudinary: {
        url: process.env.CLOUDINARY_URL || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
    },
    scrapingDog: {
        apiKey: process.env.SCRAPING_DOG_API_KEY || "",
    },
    serpApi: {
        apiKey: process.env.SERP_API_KEY || "",
    },
    trigger: {
        secretKey: process.env.TRIGGER_SECRET_KEY || "",
    },
    rateLimit: {
        burst: {
            limit: Number(process.env.RATE_LIMIT_BURST_LIMIT) || 5,
            windowMs: ms((process.env.RATE_LIMIT_BURST_WINDOW_MS || "15s") as StringValue),
        },
        hard: {
            limit: Number(process.env.RATE_LIMIT_HARD_LIMIT) || 15,
            windowMs: ms((process.env.RATE_LIMIT_HARD_WINDOW_MS || "1m") as StringValue),
        },
        ban: {
            maxMinutes: Number(process.env.RATE_LIMIT_MAX_BAN_MINUTES) || 15,
        },
    },
};
```

### 2.6 tRPC Setup

```ts
// src/server/root.ts

import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<TRPCContext>().meta<TRPCMeta>().create({
    transformer: superjson,
});

const rateLimitMiddleware = t.middleware(async ({ ctx, next, meta }) => {
    if (meta?.rateLimit) {
        await domain_checkRateLimit({ ctx, params: meta.rateLimit === true ? {} : meta.rateLimit });
    }
    return next();
});

export const publicProcedure = t.procedure.use(rateLimitMiddleware);

export const authenticatedProcedure = publicProcedure.use(async ({ ctx, next }) => {
    const session = await auth();
    if (!session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, session } });
});
```

### 2.7 Files to Delete

| Path | Reason |
|------|--------|
| `src/server/entities/` | Replaced by domain functions |
| `src/server/container/` | Replaced by context |
| `src/server/integrations/` | Replaced by `src/lib/` utilities |
| `src/server/routes/` | Replaced by `features/*/router.ts` |
| `src/server/schema/` | Replaced by `features/*/schemas.ts` |
| `src/server/drivers/` | Replaced by `src/lib/prisma.ts` + `src/lib/redis.ts` |
| `src/server/caller.ts` | Will recreate in `src/lib/trpc/` |
| `src/server/createContex.ts` | Replaced by `root.ts` |
| `src/server/createRouter.ts` | Replaced by `root.ts` |

---

## 3. Phase 2: Business Logic Validation

### 3.1 Search Flow

**Current gaps:**
- No quota enforcement (plan limits not checked)
- No concurrent search limit
- `Search.publicAccessToken` stored plaintext
- Two trigger tasks exist but only one is invoked — `scrapingdog-google-lens.ts` is dead code

**Required business rules:**

| Rule | Plan | Limit |
|------|------|-------|
| Image searches per month | Basic | 20 |
| Image searches per month | Pro | Unlimited |
| Image searches per month | Expert | Unlimited |
| Video searches per month | Basic | 0 |
| Video searches per month | Pro | 50 |
| Video searches per month | Expert | 200 |
| Concurrent searches | All | 3 |
| Search timeout | All | 5 minutes |

**Schema changes needed:**
```prisma
model SearchQuota {
    id        String   @id @default(uuid())
    userId    String   @unique
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    month     String   // "2026-04" format
    imageCount Int     @default(0)
    videoCount Int     @default(0)
    updatedAt DateTime @updatedAt
}
```

### 3.2 Stripe Webhook Flow

**Current gaps:**
- Returns 200 on processing error — Stripe never retries
- No idempotency — duplicate events create duplicate subscriptions
- No `customer.subscription.deleted` handler

**Required changes:**
- Return 500 on processing error so Stripe retries
- Add idempotency key (use Stripe event ID)
- Handle `customer.subscription.deleted`
- Log all events to audit table

```prisma
model WebhookEvent {
    id        String   @id @default(uuid())
    stripeEventId String @unique
    eventType String
    processed Boolean  @default(false)
    createdAt DateTime @default(now())
    payload   Json
}
```

### 3.3 Auth Flow

**Current gaps:**
- `auth()` called per request, no caching
- Session cache exists but `readBySessionToken` isn't used by next-auth's auth()
- No session invalidation on subscription change (existing code does this but cache is broken)

**Required changes:**
- Cache next-auth sessions in Redis (custom adapter or middleware)
- Invalidate cache on subscription update, user update, logout
- Add session device tracking (IP, user agent) like neo-console

---

## 4. Phase 3: Security Hardening

### 4.1 Token Hashing

**What gets hashed:**
- `Search.publicAccessToken` → HMAC-SHA256
- `Account.access_token` → encrypt with AES-256-GCM

**Migration:** Existing plaintext tokens need re-hashing. Add migration script:
1. Read all rows with plaintext tokens
2. Hash/encrypt in-place
3. Update column
4. Deploy new code that only works with hashed tokens

### 4.2 Rate Limiting

Port neo-console's token-bucket Lua script to `src/lib/rate-limit/`.

**Per-procedure config:**

| Procedure | Burst | Hard |
|-----------|-------|------|
| `searchWithUrl` | 3/1min | 10/5min |
| `createCheckout` | 2/1min | 5/5min |
| `readSearch` | 10/15s | 30/1min |
| `deleteSearch` | 5/15s | 15/1min |

### 4.3 Server/Client Boundaries

Add `"server-only"` import to:
- `src/server/**`
- `src/lib/env.ts`
- `src/lib/prisma.ts`
- `src/lib/redis.ts`
- `src/lib/crypto.ts`
- `src/lib/token.ts`

### 4.4 `trustHost` Restriction

```ts
// Before
trustHost: true

// After
trustHost: process.env.NODE_ENV === "production"
    ? ["visualhunt.com", "app.visualhunt.com"]
    : true
```

---

## 5. Implementation Order

### Sprint 1 — Architecture (Phase 1)

| Task | Files | Est |
|------|-------|-----|
| Create `src/lib/env.ts` | 1 new | 30min |
| Create `src/lib/prisma.ts` singleton | 1 new | 15min |
| Create `src/lib/redis.ts` singleton | 1 new | 15min |
| Create `src/server/root.ts` (context + procedures) | 1 new | 1h |
| Create `src/lib/rate-limit/` | 2 new | 1h |
| Create `src/lib/crypto.ts` | 1 new | 30min |
| Migrate `features/search/` to procedure→domain | 8 new, 8 delete | 2h |
| Migrate `features/billing/` to procedure→domain | 4 new, 4 delete | 1h |
| Migrate `features/webhook/` to domain | 3 new | 1h |
| Create output schemas for all procedures | 3 files | 1h |
| Wire up tRPC provider with superjson | 2 modify | 30min |
| Delete old entity/container/integration/schema/routes code | ~30 delete | 30min |
| Update `api/trpc/[trpc]/route.ts` | 1 modify | 15min |
| Fix Trigger.dev to use shared prisma | 2 modify | 30min |
| **Total** | | **~10h** |

### Sprint 2 — Business Logic (Phase 2)

| Task | Est |
|------|-----|
| Add `SearchQuota` model + migration | 1h |
| Implement quota check in `domain_searchWithUrl` | 2h |
| Fix Stripe webhook error handling + idempotency | 2h |
| Add `WebhookEvent` model + migration | 1h |
| Fix session caching for next-auth | 2h |
| Add device tracking to sessions | 1h |
| Remove dead trigger task | 15min |
| **Total** | **~9h** |

### Sprint 3 — Security (Phase 3)

| Task | Est |
|------|-----|
| Hash `publicAccessToken` + migration | 2h |
| Encrypt `access_token` + migration | 2h |
| Add rate limiting middleware | 1h |
| Add `server-only` boundaries | 30min |
| Restrict `trustHost` | 15min |
| Strip sensitive fields from output schemas | 30min |
| Add API versioning (`/api/v1/`) | 1h |
| **Total** | **~7h** |

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API output shape changes break frontend | High | Medium | Deploy output schemas first, verify with existing frontend before removing fields |
| Prisma migration for token hashing fails | Low | High | Test migration on staging with production data snapshot |
| Next-auth custom caching introduces auth bugs | Medium | High | Keep next-auth adapter, add Redis caching as middleware layer |
| Rate limiting blocks legitimate users | Medium | Medium | Start with generous limits, monitor, tighten |
| Trigger.dev context change breaks background jobs | Medium | Medium | Test with triggered jobs before deploying |

---

## 7. Testing Strategy

- **Unit tests** for every domain function (business logic is isolated, easy to test)
- **Integration tests** for Stripe webhooks (use Stripe test mode + webhook forwarding)
- **E2E tests** for search flow (trigger job → poll status → read results)
- **Schema tests** — verify output schemas reject sensitive fields
- **Rate limit tests** — verify burst/hard limits + ban escalation

---

## 8. Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Keep Prisma Accelerate | Team decision — maintain existing infra |
| 2 | Keep next-auth, custom auth later (Phase 4) | Reduce scope now. Custom auth is a full rewrite of session management |
| 3 | Keep ScrapingDog trigger task | Experimental — may use as fallback engine |
| 4 | Separate SearchQuota table | Atomic increments (`count + 1`), clean monthly resets (new row), queryable history, no User schema bloat |
| 5 | No API versioning | Not needed yet — single consumer (own frontend) |
