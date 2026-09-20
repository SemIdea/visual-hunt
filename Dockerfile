ARG BUN_VERSION=1-alpine
FROM oven/bun:${BUN_VERSION} AS base

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

WORKDIR /app
EXPOSE 3000

FROM base AS deps

RUN apk update \
  && apk add --no-cache openssl curl libc6-compat \
  && rm -rf /var/cache/apk/*

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile \
  && bunx prisma generate

FROM base AS test
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
CMD ["sh", "-c", "bunx prisma db push && bun run test"]

FROM base AS dev
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
CMD ["sh", "-c", "bunx prisma db push && bun run dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN bunx prisma generate
RUN bun run build

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/bun.lock ./bun.lock
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
