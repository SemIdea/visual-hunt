ARG NODE_VERSION=22-alpine
FROM node:${NODE_VERSION} AS base

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

WORKDIR /app
EXPOSE 3000

FROM base AS deps

RUN apk update \
  && apk add --no-cache openssl curl libc6-compat \
  && rm -rf /var/cache/apk/*

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci \
  && npm exec prisma generate

FROM base AS test
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["sh", "-c", "npm exec prisma db push && npm test"]

FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["sh", "-c", "npm exec prisma db push && npm run dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm exec prisma generate
RUN npm run build

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

CMD ["npm", "start"]
