# Visual Hunt

SaaS de busca visual reversa com Next.js, tRPC, Prisma/Postgres, Redis, Trigger.dev, Stripe, Cloudinary e ScrapingDog.

## Requisitos

- Node.js 22+
- npm
- PostgreSQL
- Redis
- Conta/configuracao para Trigger.dev, Stripe, Cloudinary e ScrapingDog

## Ambiente

Crie um `.env` com os valores usados por `src/server/lib/env.ts`:

```env
NEXT_PUBLIC_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/visual_hunt
REDIS_URL=redis://localhost:6379

AUTH_SESSION_ACCESS_SECRET=change-me
AUTH_SESSION_REFRESH_SECRET=change-me
AUTH_TOKEN_BYTE_LENGTH=32
AUTH_ACCESS_TOKEN_TTL=15m
AUTH_REFRESH_TOKEN_TTL=7d
AUTH_SESSION_CACHE_TTL=5m
AUTH_SESSION_CACHE_KEY_PREFIX=session:
AUTH_USER_BCRYPT_COST=12
AUTH_RATE_LIMIT_MAX=10
AUTH_RATE_LIMIT_WINDOW_MS=15s

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TRIGGER_SECRET_KEY=
SCRAPING_DOG_API_KEY=
SERP_API_KEY=
CLOUDINARY_URL=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
```

## Rodando Localmente

```bash
npm install
npm exec prisma generate
npm exec prisma db push
npm run dev
```

Em outro terminal, rode o worker do Trigger quando precisar processar buscas:

```bash
npm run trigger:dev
```

## Validacao

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm audit
```

## Docker

O projeto usa `npm` e `package-lock.json`.

```bash
npm run docker:dev
```
