# ADR-0002 — Busca visual exige usuário autenticado

> **Status:** Aceita
> **Data:** 2026-05-14
> **Decidido por:** dono do produto + Codex

## Contexto

A ideia original em `docs/IDEA.md` citava uma interface simples sem autenticação. O código atual, porém, já modela `Search.userId` como obrigatório, expõe histórico por usuário e usa sessão própria com access/refresh token. Suportar busca anônima agora exigiria mudar schema, autorização, histórico, billing e retenção de dados.

## Decisão

Busca visual no Visual Hunt exige usuário autenticado.

O contrato público atual é:

- Criar busca: `search.startSearch`.
- Ler busca: `search.getSearch`, filtrando por `ctx.session.userId`.
- Listar histórico: `search.getSearchHistory`, filtrando por `ctx.session.userId`.
- Remover busca: `search.deleteSearch`, filtrando por `ctx.session.userId`.

Rotas e componentes que iniciam busca devem redirecionar visitantes sem sessão para `/auth/login`.

## Alternativas consideradas

- **Busca anônima com `Search.userId` nullable.** Rejeitada porque complica histórico, billing e isolamento de dados antes do MVP.
- **Busca pública por ID.** Rejeitada porque UUID por si só não é autorização suficiente para resultado potencialmente sensível.
- **Busca pública por token dedicado.** Adiada; pode voltar quando houver requisito explícito de compartilhamento.

## Consequência

O produto fica coerente com histórico, assinatura e isolamento por usuário. Compartilhamento público de uma busca passa a ser feature futura e deve ter token próprio, expiração e decisão de privacidade.

## Referências

- ADR anterior: `docs/adr/0001-adapt-afm-to-next-trpc.md`
- PRD: `docs/prd.md` RF-02, RNF-02
- UST: `docs/ust.md` US-002, US-003, US-004
