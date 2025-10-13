# Base image
ARG NODE_VERSION=current-alpine
FROM node:${NODE_VERSION} AS base

# Environment setup
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Enable Corepack so pnpm is available in all stages
RUN corepack enable

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app
EXPOSE 3000

# Dependencies stage
FROM base AS deps

RUN apk update \
  && apk add --no-cache openssl curl libc6-compat \
  && rm -rf /var/lib/apt/lists/* /var/cache/apk/*

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile --prefer-offline \
  && pnpm exec prisma generate

# Test stage
FROM base AS test
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["sh", "-c", "pnpm exec prisma db push && pnpm test"]


# Development image
FROM base AS dev
WORKDIR /app
COPY . .
RUN pnpm install
CMD ["sh", "-c", "pnpm exec prisma db push && pnpm dev"]

# Builder stage
FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Install ALL dependencies (including devDependencies) needed for build
RUN NODE_ENV=development pnpm install --frozen-lockfile

# Set production environment for the build process
ENV NODE_ENV=production

COPY . .

RUN pnpm exec prisma generate
RUN pnpm build

# Production image
FROM base AS production

ENV NODE_ENV=production

WORKDIR /app
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/. .

CMD ["sh", "-c", "pnpm exec prisma db push && pnpm start"]