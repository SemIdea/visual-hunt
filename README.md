# Visual Hunt

Reverse image search as a SaaS — upload an image and find where it appears online, on a
subscription. Built as a full-stack engineering study: type-safe end to end, long-running work
in background jobs, payments, and a layered backend.

> **Portfolio / study project.** It is not a hosted service and there is no public deploy.
> See [Legal](#legal).

## What it does

1. Upload an image (Cloudinary) and start a reverse search.
2. A background task (Trigger.dev) calls a reverse-image-search provider and stores the results.
3. Results are listed per search. The free tier is limited; paid tiers are Stripe subscriptions.
4. Auth with access + refresh tokens, Redis-backed sessions, and rate limiting.

## Architecture

```
Next.js App Router
  └── tRPC procedure ── domain ── repository (Prisma) ── PostgreSQL
                                  └── Redis (session cache, dedup)
  └── Trigger.dev task (start-search)
          └── provider adapter (ScrapingDog / Google Lens)

Stripe (subscriptions + webhook) · Cloudinary (media)
```

- **tRPC v11** for end-to-end types — no schema layer, so the client and the server cannot drift.
- **Prisma 7 + PostgreSQL** for persistence; **Redis** for the session cache and dedup.
- **Trigger.dev** runs the search outside the request lifecycle, so a slow provider never blocks a request.
- **Stripe** subscriptions with a webhook that keeps `User.stripeCustomerId` and `Subscription` current.
- **Zod** at the boundaries, **Vitest** for tests, **Biome** for lint/format, **Docker** for local and prod.

## Stack

Next.js 15 · React 19 · TypeScript · tRPC v11 · Prisma 7 · PostgreSQL · Redis (ioredis) ·
Trigger.dev · Stripe · Cloudinary · Tailwind CSS 4 · Radix UI · Zod · Vitest · Biome · Docker

## Run locally

Requires **Node 22+**, **PostgreSQL** and **Redis**. You also need accounts/keys for Trigger.dev,
Stripe, Cloudinary and the reverse-search provider.

1. Create a `.env` from [`example.env`](./example.env) and fill it in.
2. Install and prepare the database:

   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate:dev
   ```

3. Start the app, and in another terminal the Trigger.dev worker:

   ```bash
   npm run dev
   npm run trigger:dev
   ```

## External flows

- **Stripe webhook** → point it at `/api/webhook/stripe`; handle `checkout.session.completed` and the subscription events.
- **Trigger.dev** → the main task is `start-search`; the server enqueues it from `src/server/lib/tasks.ts`.
- **Cloudinary** → keep an upload preset named `default_visual` for the home flow.
- **Search provider** → isolated in `src/trigger/lib/scrapingdog.ts`. A provider failure ends the search with a terminal status instead of breaking the app.

## Validation

```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```

## Legal

This is an educational, portfolio project — not a hosted service, and **not affiliated with Google**.

Reverse image search here goes through third-party scraping providers (ScrapingDog, SerpAPI).
Operating a public service on top of them may violate their terms and Google's, and re-publishing
images found online may raise copyright issues. The repository ships **no** credentials and
operates nothing: bring your own keys and comply with every provider's terms.

## License

[MIT](./LICENSE)
