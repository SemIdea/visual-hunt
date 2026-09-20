# Gotchas — Surpresas que Travam Outro Dev

> Cada item tem gatilho, comportamento contraintuitivo e solução.
> Só registre aqui o que já travou o projeto ou tem alta chance de travar novamente.

## Build Next.js — clients server-side não podem conectar no import

**Gatilho:** se você está mexendo em `src/server/lib/stripe.ts`, `src/server/lib/redis.ts`, `src/server/root.ts` ou algo importado por `src/app/api/trpc/[trpc]/route.ts`.

**Comportamento:** o build do Next importa módulos server-side para analisar rotas. Se Stripe/Redis validar env ou abrir conexão no topo do módulo, `bun run build` pode falhar mesmo sem usar aquele recurso na página renderizada.

**Solução:** manter lazy init por função/proxy. Import de módulo não deve conectar nem exigir secret além do necessário para o caminho executado.

## Next.js com `src/app` — `middleware.ts` só é lido dentro de `src/`

**Gatilho:** se você está criando ou movendo `middleware.ts`.

**Comportamento:** o projeto usa `src/app`. Nesse layout, o Next.js só carrega `middleware.ts` de dentro de `src/` — um `middleware.ts` na raiz do projeto é silenciosamente ignorado, sem erro nem warning de build. Isso já aconteceu aqui: o middleware de lockdown de produção (`PORTFOLIO_LOCKDOWN`) foi criado na raiz e nunca rodou.

**Solução:** sempre `src/middleware.ts`. Depois de criar/mover, confirmar no output de `bun run build` que aparece a linha `ƒ Middleware` — se sumir, o arquivo está no lugar errado.

## Prisma 7 — build script não usa `--no-engine`

**Gatilho:** se você está alterando `package.json`, Prisma ou Dockerfile.

**Comportamento:** Prisma 7 rejeita flags antigas usadas em versões anteriores. `prisma generate --no-engine` quebra; o projeto usa `prisma generate --no-hints && next build`.

**Solução:** preservar o script atual ou validar com `bun run build` após qualquer alteração em Prisma/build.

## Gerenciador de pacotes é bun — lockfile e audit

**Gatilho:** se você está instalando dependência, editando `package.json`/`overrides` ou rodando audit.

**Comportamento:** desde 2026-09-20 o projeto usa **bun** (`bun.lock`), não npm. `package-lock.json` foi removido — ter os dois lockfiles ao mesmo tempo deixa o build do Vercel ambíguo sobre qual gerenciador usar. `bun test`/`bun build` **não** são o mesmo que rodar os scripts do `package.json` (são o test runner e o bundler nativos do bun) — sempre `bun run test` / `bun run build`. `bun audit` reporta bem mais que `npm audit` reportava (árvore transitiva mais funda).

**Solução:** instalar com `bun install`, nunca `npm install`. Rodar `bun audit` depois de qualquer mudança de dependência.

## Trigger.dev — audit depende de overrides transitivos

**Gatilho:** se você está atualizando `@trigger.dev/*`, `bun.lock` ou removendo `overrides` do `package.json`.

**Comportamento:** o Trigger.dev puxa dependências transitivas antigas (`cookie`, `systeminformation`, `@hono/node-server`, `ws`, `socket.io-parser`, `uuid`). Migração pra bun em 2026-09-20 achou e corrigiu 2 críticas (Next.js RCE, fora do Trigger.dev) e várias altas via overrides explícitos (`ws`, `sharp`, `vite`, `qs`, `protobufjs`, `socket.io-parser`, `uuid`, `valibot`, `systeminformation`). `bun audit` ainda mostra ~47 avisos altos/moderados — praticamente todos em ferramentas de dev/build (CLI do Prisma, commitlint, internals do SDK do Trigger.dev), fora do caminho que roda em produção. Aceito como dívida rastreada, não bloqueio: **0 críticas** é a barra atual.

**Solução:** rodar `bun audit` depois de qualquer mudança de dependência. Remover override só quando a árvore oficial resolver a vulnerabilidade sem regressão. Revisitar o número de avisos restantes se o projeto sair de "portfólio" pra algo com uso real.

## Trigger.dev — runtime separado do servidor tRPC

**Gatilho:** se você está escrevendo task em `src/trigger/*`.

**Comportamento:** task roda fora do request tRPC. Ela não recebe `TRPCContext`, sessão ou services do `src/server/root.ts`.

**Solução:** task deve montar dependências próprias em `src/trigger/lib/*`, ler estado canônico do Postgres e persistir status/resultados. Regras compartilhadas precisam virar lib explícita, não import implícito de procedure.

## Search — contrato público canônico

**Gatilho:** se você está mexendo em `src/server/features/search/router.ts`, upload da home, dashboard ou página `/search/[id]`.

**Comportamento:** o fluxo antigo de busca por URL foi removido. O contrato canônico é `startSearch`, `getSearch`, `getSearchHistory` e `deleteSearch`.

**Solução:** não reintroduzir aliases de compatibilidade sem ADR. Entrada por URL continua existindo na UI, mas a procedure recebe `imageUrl` depois da normalização/upload.

## Cloudinary — URL remota pode falhar antes da busca

**Gatilho:** se você está alterando upload por URL ou entrada da busca visual.

**Comportamento:** algumas URLs públicas podem não ser importadas pelo Cloudinary por bloqueio remoto, CORS, content-type ou timeout. A busca falha antes de chegar ao provider visual.

**Solução:** tratar erro de importação como erro de input/upload, não como falha do provider de busca. Upload direto de arquivo deve ser o caminho mais confiável.

---

Adicionar gotcha novo: copie o formato acima, coloque em ordem por área e linke ADR/BUGS quando existir.

<!--
CANDIDATOS DE SEED (plugin afm — módulos detectados no stack). NÃO estão ativos.
Ative movendo pra cima (formato Gatilho/Comportamento/Solução) só o que já mordeu o time aqui.
Fonte completa: framework-template/modules/<stack>/gotchas.seed.md

Next.js App Router:
- `cookies()`/`headers()` de next/headers só rodam em Server Component / route handler — jogam erro em lib pura ou Client Component.
- `revalidatePath`/`revalidateTag` invalida o cache do Next, mas não o cache do React Query no cliente — precisa invalidar a query também.
- root layout sob segmento dinâmico ([lang]) deixa `_not-found` órfão — usar `app/global-not-found.tsx` + `experimental.globalNotFound`.

Trigger.dev v4:
- `ctx.run.id` muda entre tentativas de retry — runId que rastreia processo é imutável após 1ª escrita (usar `updateMany({ where:{ id, runId:null } })`). (Parcialmente coberto pela regra dura 11.)
- binários invocados como subprocess (esbuild/tsdown) quebram se bundleados — manter em `trigger.config.ts` build.external.

Stripe billing:
- subscription anexada a SubscriptionSchedule é imutável — chamar releaseSubscriptionSchedule antes de mutar.
- `lookupKey` de Price é imutável pós-publish — trocar força novo Product e desancora subs existentes.
- `customer.subscription.updated` chega múltiplas vezes (at-least-once) — UPSERT idempotente por stripeSubscriptionId. (Relacionado à regra dura 12.)
-->

