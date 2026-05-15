# Auth — Estado Atual e Pendências

O registro de usuário já foi implementado no servidor e no cliente. Este arquivo deixa de ser plano inicial e passa a registrar pendências reais do fluxo de autenticação.

## Já Implementado

- `src/server/features/auth/schemas.ts` define `registerInputSchema`, `loginInputSchema`, sessão e schemas de resultado.
- `src/server/features/auth/domains/register.ts` valida email único, hasheia senha e cria sessão.
- `src/server/features/auth/procedures/register.ts` expõe `auth.register`.
- `src/server/features/auth/router.ts` registra login, register, logout, refresh e me.
- `src/app/auth/register/page.tsx` renderiza o fluxo de registro.
- `src/app/auth/register/_components/form/index.tsx` chama `trpc.auth.register`.
- Registro e login redirecionam para `/dashboard` após sucesso.
- Header unauthenticated tem entrada para registro.
- Testes unitários cobrem domínios principais de auth.
- Há teste de procedure para `auth.register`.

## Pendências

- [ ] Definir política de verificação de email antes de produção.
- [ ] Definir política de rotação/revogação global de sessões.
- [ ] Decidir se o fluxo inteiro de auth deve permanecer em inglês ou virar português antes de lançar.

## Riscos Relacionados

- Sessões dependem de Redis para cache/rate limit; queda de Redis precisa falhar de forma controlada.
- Busca exige usuário autenticado por ADR-0002; se o produto voltar a aceitar busca anônima, auth e schema de Search precisam de nova ADR.
