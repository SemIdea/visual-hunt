<!--
afm:state=bootstrapped
Arquitetura adaptada para o projeto real em ADR-0001.
Mudanças arquiteturais relevantes exigem nova ADR em docs/adr/.
-->

# ACH — Architecture Guide

> Guia vivo de arquitetura do Visual Hunt.
> Este documento responde: "onde ponho essa lógica?", "qual boundary valida input?", "qual teste acompanha a mudança?".

Docs relacionados: `docs/prd.md`, `docs/ust.md`, `docs/afm.md`, `docs/gotchas.md`, `docs/adr/`.

## 1. Arquitetura Macro

```
Browser / Next App Router
        |
        v
src/app/** UI + route handlers
        |
        v
src/app/api/trpc/[trpc]/route.ts
        |
        v
src/server/index.ts -> appRouter
        |
        v
src/server/features/<feature>/
  router.ts -> procedures/* -> domain(s)/*
        |
        +--> Prisma/Postgres
        +--> Redis session/cache/rate-limit
        +--> Stripe checkout/webhook
        +--> Trigger.dev tasks in src/trigger/*
                  |
                  +--> ScrapingDog / Google Lens providers
                  +--> Prisma writes Search/Result status
```

## 2. Entidades Canônicas

As entidades atuais vêm de `prisma/schema.prisma`:

- **User:** conta do usuário, credenciais, Stripe customer e vínculo com buscas.
- **Session:** access/refresh token hasheados, device info, expiração e revogação.
- **Search:** busca visual iniciada por usuário, com `source`, `status`, `jobId` e `publicAccessToken`.
- **Result:** resultado normalizado de provedor externo, vinculado a `Search`.
- **Subscription:** estado da assinatura Stripe por usuário.

Lifecycle principal de busca:

1. UI envia imagem/URL.
2. tRPC protected procedure valida sessão e input.
3. Domain cria `Search` em Postgres.
4. `taskRegistry.startSearch.trigger` dispara `start-search`.
5. Trigger executa provider externo e persiste `Result[]`.
6. Task atualiza `Search.status` para `COMPLETED`, `EMPTY` ou `FAILED`.
7. UI consulta `/search/[id]` e/ou histórico via tRPC.

## 3. Arquitetura de Pastas

```
src/
├── app/
│   ├── (home)/                         # home, upload e entrada do fluxo
│   ├── api/
│   │   ├── trpc/[trpc]/route.ts         # boundary HTTP tRPC
│   │   └── webhook/stripe/route.ts      # boundary HTTP Stripe
│   ├── auth/                           # login/register
│   ├── dashboard/                      # histórico/conta
│   ├── pricing/                        # planos/checkout
│   └── search/[id]/page.tsx             # detalhe da busca
├── components/                         # UI compartilhada
├── lib/                                # client-side libs e providers
├── server/
│   ├── index.ts                        # appRouter
│   ├── root.ts                         # contexto, public/protected procedures
│   ├── caller.ts                       # caller server-side
│   ├── features/
│   │   └── <feature>/
│   │       ├── router.ts
│   │       ├── procedures/<action>.ts
│   │       ├── domain/<action>.ts ou domains/<action>.ts
│   │       ├── schemas.ts
│   │       └── *.test.ts
│   └── lib/                            # Prisma, Redis, Stripe, crypto, token, tasks
├── trigger/
│   ├── start-search.ts                 # orchestrator principal
│   ├── <provider>.ts                   # tasks/provider jobs
│   ├── lib/                            # provider clients/env/prisma edge
│   └── *.test.ts
└── generated/prisma/                   # Prisma Client gerado
```

## 4. Componentes de Primeira Classe

### Procedure-like: tRPC procedures

**Path:** `src/server/features/<feature>/procedures/<action>.ts`.

Responsabilidades:

- Validar input com Zod no boundary.
- Escolher `publicProcedure` ou `protectedProcedure`.
- Orquestrar chamada para domain.
- Retornar DTO serializável para UI.

Não fazer:

- Query complexa inline se a regra pertence ao domain.
- Acessar secrets direto quando já existe helper/contexto.
- Misturar regra de UI com regra de negócio.

Exemplo atual: `src/server/features/search/procedures/start-search.ts`.

### Domain-like: regra de negócio server-side

**Path:** `src/server/features/<feature>/domain/*` ou `domains/*`.

Responsabilidades:

- Aplicar regras de negócio.
- Usar `ctx.db`, `ctx.redis`, `ctx.services`, `ctx.tasks` recebidos por contexto.
- Lançar `TRPCError` com código coerente quando a regra falha.
- Ser testável com mocks de contexto.

Não fazer:

- Criar singleton próprio de Prisma/Redis/Stripe.
- Revalidar input com Zod que já foi validado na procedure.
- Logar secrets, tokens, senhas ou payload sensível.

Exemplos atuais:

- `src/server/features/auth/domains/register.ts`
- `src/server/features/search/domain/start-search.ts`
- `src/server/features/checkout-session/domain/create-checkout-session.ts`

### Task-like: Trigger.dev tasks

**Path:** `src/trigger/*.ts`.

Responsabilidades:

- Executar trabalho assíncrono, lento ou com retry.
- Ler estado canônico do Postgres.
- Ser idempotente: retry não duplica side-effects nem corrompe estado.
- Persistir status terminal claro em `Search`.

Não fazer:

- Depender de estado em memória do run.
- Sobrescrever rastreadores imutáveis sem necessidade.
- Deixar falha externa derrubar o app principal.

Exemplo atual: `src/trigger/start-search.ts`.

### Lib-like: integrações e helpers

**Paths:**

- `src/server/lib/*` para runtime server/tRPC.
- `src/trigger/lib/*` para runtime Trigger.dev.
- `src/lib/*` para client/shared app.

Responsabilidades:

- Encapsular detalhes de biblioteca externa.
- Expor funções pequenas e nomeadas.
- Manter lazy init para clients que exigem env/runtime (`stripe`, `redis`).

Não fazer:

- Criar "utils" genérico sem domínio.
- Importar UI dentro de server lib.
- Importar server-only dentro de client component.

## 5. Regras de Import

```
src/app/** client components       -> não importam src/server/**
src/app/** server components       -> podem chamar caller/server helpers quando necessário
src/app/api/** route handlers      -> podem importar src/server/** e libs server-side
src/server/features/<X>/**         -> podem importar src/server/lib/**, Prisma types e o próprio feature
src/server/features/<X>/**         -> não importam outro feature diretamente; use appRouter/caller ou extraia lib
src/server/lib/**                  -> não importa src/app/** nem components/**
src/trigger/**                     -> não importa UI nem tRPC procedures
src/trigger/lib/**                 -> encapsula env/client/provider específico do worker
```

Cross-feature direto é permitido só quando for contrato deliberado e documentado em ADR. Caso contrário, promova o código compartilhado para `src/server/lib/*` ou modele uma procedure/domain própria.

## 6. Estado e Segurança

- Postgres é source of truth de produto.
- Redis é cache/rate-limit/sessão auxiliar; não é fonte autoritativa.
- Cloudinary é armazenamento público/temporário da imagem de entrada.
- Stripe é fonte externa de billing, refletida em `Subscription`.
- Trigger.dev é orquestrador de execução assíncrona, não substitui status em Postgres.
- Access/refresh tokens persistidos só como hash.
- Qualquer log de senha, token, secret ou URL sensível é bug crítico.

## 7. Testes

Vitest descobre testes próximos ao código. Padrão atual:

- Domain tests: `src/server/features/**/**.test.ts`.
- Lib tests: `src/server/lib/*.test.ts`.
- Trigger tests: `src/trigger/*.test.ts` e `src/trigger/lib/*.test.ts`.

Escala esperada:

- Mudança em domain/procedure: teste unitário do domain e, quando possível, teste do router/procedure.
- Mudança em task: teste de sucesso, falha e rerun/idempotência.
- Mudança em lib de integração: teste de contrato com mock do provider.
- Mudança visual simples: type-check/lint; teste só quando há regra de comportamento.

Comandos de validação:

```sh
bun run test
bunx tsc --noEmit
bun run lint
bun run build
bun audit
```

## 8. Convenções

| Camada | Export | Arquivo |
| --- | --- | --- |
| tRPC router | `router_<feature>` | `src/server/features/<feature>/router.ts` |
| Procedure | `procedure_<action>` | `procedures/<action>.ts` |
| Domain | `domain_<action>` | `domain/<action>.ts` ou `domains/<action>.ts` |
| Task registry | `taskRegistry.<name>` | `src/server/lib/tasks.ts` |
| Trigger task | `<name>Job` ou nome claro do provider | `src/trigger/<kebab-name>.ts` |
| Schema Zod | `<name>Schema` | `schemas.ts` ou `<feature>/types.ts` |
| Client component | PascalCase/default local | `src/app/**/_components/**/index.tsx` |

## 9. Quando Criar ADR

Crie ADR em `docs/adr/NNNN-titulo.md` quando:

- Mudar boundary de API, auth, billing ou task.
- Adicionar provider de busca com contrato novo.
- Mudar schema de forma não trivial.
- Introduzir nova camada, fila, cache ou storage.
- Trocar dependência central.
- Divergir conscientemente deste guia.

Não precisa ADR para bugfix local, copy de UI, teste faltante ou pequena extração sem mudança de contrato.

## 10. Mapa Rápido por Tarefa

- **Nova endpoint tRPC:** `features/<feature>/schemas.ts` -> `procedures/*` -> `domain/*` -> `router.ts`.
- **Nova regra de busca:** `src/server/features/search/domain/*` + teste.
- **Nova execução assíncrona:** `src/trigger/*` + `src/server/lib/tasks.ts` + teste de idempotência.
- **Novo provider externo:** `src/trigger/lib/<provider>.ts` + task/provider + normalização para `Result`.
- **Novo dado persistido:** `prisma/schema.prisma` + migração/geração + testes afetados.
- **Novo fluxo UI:** `src/app/<route>` + componentes locais + chamada tRPC client.

---

Mudanças neste guia devem manter compatibilidade com ADR-0001 ou registrar nova ADR.
