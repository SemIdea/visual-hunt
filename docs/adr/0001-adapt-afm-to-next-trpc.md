# ADR-0001 — Adaptar AFM para Next.js e tRPC

> **Status:** Aceita
> **Data:** 2026-05-14
> **Decidido por:** dono do produto + Codex

## Contexto

Os documentos AFM/ACH vieram de um template de backend Express com `src/modules/*`, controllers REST, OpenAPI e `@neotrip-ai/layers`. O repositório real do Visual Hunt já usa Next.js App Router, React, tRPC, Prisma, Redis, Stripe, Cloudinary e Trigger.dev. Aplicar o template literalmente exigiria mover a arquitetura para Express/modules, o que contradiz a restrição de não mexer na arquitetura e aumentaria o risco de quebrar um projeto que acabou de voltar a buildar.

## Decisão

O contrato AFM será adaptado para a arquitetura existente do Visual Hunt.

Mapeamento operacional:

- **Boundary HTTP:** `src/app/api/trpc/[trpc]/route.ts` e rotas específicas em `src/app/api/**`.
- **Router raiz:** `src/server/index.ts`.
- **Procedure-like:** tRPC procedures em `src/server/features/<feature>/procedures/*`.
- **Domain-like:** funções de regra de negócio em `src/server/features/<feature>/domain/*` ou `domains/*`, conforme pasta já existente.
- **Task-like:** Trigger.dev tasks em `src/trigger/*`.
- **Lib-like:** helpers autocontidos em `src/server/lib/*`, `src/lib/*` ou `src/trigger/lib/*` conforme runtime.
- **UI:** App Router em `src/app/**` e componentes compartilhados em `src/components/**`.

O projeto não deve criar `src/modules/*`, Express controllers ou dependência de `@neotrip-ai/layers` apenas para obedecer ao template original.

## Alternativas consideradas

- **Migrar o projeto para Express/modules.** Rejeitada porque é mudança arquitetural grande, fora do pedido atual e sem ganho direto para o MVP.
- **Ignorar os docs AFM.** Rejeitada porque o método de PRD/UST/ADR/gotchas é útil e melhora governança do projeto.
- **Manter dois guias paralelos.** Rejeitada porque documentação divergente vira fonte de erro.

## Consequência

Fica mais claro onde cada tipo de mudança deve morar no código atual. Algumas regras do template precisam de versão equivalente para `src/server/features` e `src/trigger`, não para `src/modules`. Qualquer migração futura para outra arquitetura exigirá nova ADR.

## Referências

- PRD: `docs/prd.md`
- UST: `docs/ust.md`
- ACH: `docs/ach.md`
- AFM: `docs/afm.md`
