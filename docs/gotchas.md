# Gotchas — Surpresas que Travam Outro Dev

> Cada item tem gatilho, comportamento contraintuitivo e solução.
> Só registre aqui o que já travou o projeto ou tem alta chance de travar novamente.

## Build Next.js — clients server-side não podem conectar no import

**Gatilho:** se você está mexendo em `src/server/lib/stripe.ts`, `src/server/lib/redis.ts`, `src/server/root.ts` ou algo importado por `src/app/api/trpc/[trpc]/route.ts`.

**Comportamento:** o build do Next importa módulos server-side para analisar rotas. Se Stripe/Redis validar env ou abrir conexão no topo do módulo, `npm run build` pode falhar mesmo sem usar aquele recurso na página renderizada.

**Solução:** manter lazy init por função/proxy. Import de módulo não deve conectar nem exigir secret além do necessário para o caminho executado.

## Prisma 7 — build script não usa `--no-engine`

**Gatilho:** se você está alterando `package.json`, Prisma ou Dockerfile.

**Comportamento:** Prisma 7 rejeita flags antigas usadas em versões anteriores. `prisma generate --no-engine` quebra; o projeto usa `prisma generate --no-hints && next build`.

**Solução:** preservar o script atual ou validar com `npm run build` após qualquer alteração em Prisma/build.

## Trigger.dev — audit limpo depende de overrides transitivos

**Gatilho:** se você está atualizando `@trigger.dev/*`, `package-lock.json` ou removendo `overrides` do `package.json`.

**Comportamento:** versões atuais do Trigger.dev podem puxar dependências transitivas que aparecem no `npm audit` (`cookie`, `systeminformation`, `@hono/node-server`). O projeto está limpo com overrides explícitos.

**Solução:** rodar `npm audit` depois de qualquer mudança de dependência. Remover override só quando a árvore oficial resolver a vulnerabilidade sem regressão.

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
