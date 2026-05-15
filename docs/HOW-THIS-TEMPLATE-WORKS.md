# Como a Documentação do Visual Hunt Funciona

Este diretório nasceu de um template AFM, mas foi adaptado para o projeto real em `docs/adr/0001-adapt-afm-to-next-trpc.md`. A arquitetura vigente é Next.js App Router + tRPC + Prisma + Trigger.dev.

## Onde Cada Coisa Vive

| Documento | Função |
| --- | --- |
| `prd.md` | Produto, escopo, RF/RNF, métricas e não-escopo. |
| `ust.md` | Backlog de user stories com critérios de aceitação. |
| `ach.md` | Guia de arquitetura: onde colocar código e como as camadas conversam. |
| `afm.md` | Método de trabalho: fluxo, regras duras, Definition of Done. |
| `gotchas.md` | Surpresas operacionais já conhecidas. |
| `gotchas.md` | Surpresas operacionais e riscos conhecidos que merecem registro curto. |
| `adr/` | Decisões arquiteturais versionadas. |
| `IDEA.md` | Ideia original do produto; referência histórica, não contrato atual. |

## Como Aplicar no Dia a Dia

1. Antes de feature, confira `prd.md` e crie/atualize uma US em `ust.md`.
2. Antes de mexer em camadas, confira `ach.md`.
3. Antes de tocar Trigger, Prisma, Stripe, Redis ou Cloudinary, confira `gotchas.md`.
4. Se a mudança alterar contrato entre camadas, crie uma ADR.
5. Se encontrar risco operacional que vale preservar, registre em `docs/gotchas.md`.
6. Ao fechar a tarefa, rode o checklist de `afm.md`.

## O Que Não Fazer

- Não recriar `src/modules/*` ou Express controllers por causa do template antigo.
- Não usar `IDEA.md` para contradizer `prd.md`; primeiro atualize o PRD.
- Não esconder decisão arquitetural em commit de código; use ADR.
- Não deixar TODO solto em comentário se ele representa risco de produto; use `docs/gotchas.md`, `docs/adr/` ou `ust.md`.

## Fluxo Recomendado para Próximas Mudanças

```sh
# entender escopo
docs/prd.md -> docs/ust.md -> docs/ach.md -> docs/gotchas.md

# implementar
teste/type-check -> código -> refactor -> validação

# reconciliar
docs/gotchas.md ou docs/adr/ quando necessário
```

Este arquivo é um guia de navegação. O contrato técnico detalhado fica em `ach.md` e `afm.md`.
