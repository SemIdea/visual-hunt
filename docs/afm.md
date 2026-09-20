<!--
afm:state=bootstrapped
Adaptado para Visual Hunt em ADR-0001.
Regras de processo vivem aqui; detalhes estruturais vivem em docs/ach.md.
-->

# AFM — Agent Flow Methodology

> Playbook operacional para trabalhar no Visual Hunt.
> Mistura XP, Pragmatic Programmer e regras específicas deste projeto.

Se este doc divergir do código atual, confira `docs/ach.md` e registre ajuste em ADR quando for mudança arquitetural.

## 1. Princípios

- **TDD proporcional ao risco:** bug novo pede teste que reproduz; feature nova pede teste do comportamento central; mudança visual simples pode ficar em type-check/lint quando não há regra de negócio.
- **Tracer bullets:** entregar fluxo fim-a-fim fino antes de engrossar casos especiais.
- **KISS/YAGNI:** preferir solução pequena e local; abstração só quando o terceiro caller confirmar padrão.
- **Broken windows:** build, type-check, audit ou teste quebrado vira correção imediata ou item explícito em `docs/gotchas.md`/ADR.
- **Segurança não é escopo opcional:** tokens, senhas, secrets e URLs sensíveis não entram em log.
- **Postgres é fonte de verdade:** Redis/cache/Trigger run não substituem estado persistido.
- **Tasks são idempotentes:** retry de Trigger.dev não duplica resultado nem corrompe status.
- **Arquitetura atual vence o template:** Next.js App Router + tRPC + `src/server/features` é o contrato vigente.

## 2. Flow de uma Tarefa

1. **Ler:** `docs/prd.md`, `docs/ust.md`, `docs/ach.md`, `docs/gotchas.md` e arquivos vizinhos.
2. **Entender:** explicar em 2 frases o que muda e por quê.
3. **Planejar:** listar arquivos tocados; se mudar arquitetura, parar e criar/perguntar ADR.
4. **Red:** escrever teste ou type check que falha quando fizer sentido.
5. **Green:** implementar o mínimo.
6. **Refactor:** limpar duplicação/nome/tipos sem mudar comportamento.
7. **Validar:** rodar comandos proporcionais e, antes de fechar, suíte relevante.
8. **Reconciliar docs:** PRD/UST/ACH/BUGS/gotchas/ADR quando aprendizado precisar sobreviver à sessão.
9. **Commit:** Conventional Commit pequeno e coerente quando o usuário pedir commit ou no fluxo normal de entrega.

## 3. Regras Duras

1. **Não commitar com type-check quebrado.**
   Verificação: `bunx tsc --noEmit`.

2. **Não commitar com teste afetado quebrado.**
   Verificação mínima: `bun run test` ou teste específico durante o ciclo.

3. **Não commitar build quebrado em mudança que toca runtime/build/deps.**
   Verificação: `bun run build`.

4. **Não deixar vulnerabilidade acionável sem decisão.**
   Verificação: `bun audit`. Se não corrigir, registrar em `docs/gotchas.md` com severidade e motivo, ou em ADR se for decisão de contrato.

5. **Boundary valida input com Zod.**
   Procedures tRPC, webhook payloads e env parsing validam entrada antes de domain.

6. **Domain não cria singleton de infra.**
   Domain usa `ctx.db`, `ctx.redis`, `ctx.services`, `ctx.tasks` ou helper injetado. Não usa `new PrismaClient`, `new Redis` ou `new Stripe`.
   Verificação: `rg -n "new PrismaClient|new Redis|new Stripe" src/server/features`.

7. **Client component não importa server-only.**
   Arquivos com `"use client"` não importam `src/server/**`, Prisma, Stripe, Redis ou `node:*`.
   Verificação: revisão + `rg -n "\"use client\"" src/app src/components`.

8. **Tokens, senhas e secrets não vão para log.**
   Verificação: `rg -n "console\\.log|logger|token|secret|password" src`.

9. **Busca e histórico são isolados por usuário.**
   Query de `Search` em rota autenticada filtra por `ctx.session.userId`, exceto leitura pública por token explicitamente desenhada.

10. **Task Trigger.dev é idempotente.**
    Toda task que escreve DB tem teste ou regra clara de rerun. Status terminal deve permitir early return ou escrita segura.

11. **`jobId`/run rastreável não é sobrescrito sem motivo.**
    Se um run já foi gravado para uma busca, retry não deve apagar a referência útil.

12. **Webhook Stripe valida assinatura antes de mutar DB.**
    Nunca confiar em payload sem `stripe.webhooks.constructEvent`.

13. **Schema Prisma destrutivo exige plano forward-compatible.**
    Drop/rename precisa de fase intermediária ou janela controlada.

14. **Sem compatibilidade falsa escondida.**
    Alias antigo de API só entra com ADR, plano de remoção e teste cobrindo o caller real.

15. **Arquivo com responsabilidade difusa deve ser dividido.**
    Sinais: `utils`, `manager`, `and`, múltiplos exports de camadas diferentes ou arquivo acima de 300 linhas fora de gerados/fixtures.

16. **Dependência nova precisa de motivo.**
    Commit/PR explica uso, alternativa e impacto. `bun audit` precisa continuar limpo ou risco documentado.

## 3.1 Regras forward-only

Adoção canônica do plugin `afm` via `/afm:refactor` em 2026-08-31. As regras da § 3 se aplicam a **código novo a partir desta data** e a **arquivos modificados** (boy-scout rule). Código legado que viole é tech-debt rastreado, não bloqueio de PR.

Auditoria mecânica na adoção (gatilhos das regras § 3 rodados contra o código atual):

| Regra | Gatilho | Resultado na adoção | Situação |
| --- | --- | --- | --- |
| 1 — type-check | `npx tsc --noEmit` | limpo | aplica desde já |
| 15 — arquivo com responsabilidade difusa (>300 linhas) | `wc -l` em `src/**` (excl. `src/generated`) | 0 arquivos >300 linhas | aplica desde já |
| 4/16 — audit | `: any` / `@ts-ignore` em `src/**` | 0 ocorrências | aplica desde já |
| 6 — domain não cria singleton de infra | `rg "new PrismaClient\|new Redis\|new Stripe" src/server/features` | 0 ocorrências | aplica desde já |
| 2 — teste proporcional ao risco | 19 arquivos de teste cobrindo domains/procedures/libs/tasks | proporcional (não é meta de cobertura fixa) | aplica desde já |

**Nenhuma carve-out forward-only foi necessária:** o código já satisfaz as regras duras na data da adoção. A cláusula forward-only fica documentada como contrato — se um sweep futuro ou merge legado introduzir violação preexistente, ela é tech-debt rastreado (issue/ADR), não trava o PR do escopo em andamento.

**Critério de boy-scout:** ao editar arquivo legado que viole uma regra da § 3, traz pra conformidade no mesmo PR quando o escopo justifica (não força refactor de 500 linhas pra corrigir typo). Senão, abre issue separada e linka.

## 4. Guidelines por Tipo de Mudança

### Bug fix

1. Reproduzir em teste quando for regra de negócio, task, auth, billing ou parsing.
2. Implementar fix mínimo.
3. Rodar teste afetado, `bunx tsc --noEmit` e lint quando tocar TS/React.
4. Atualizar `docs/gotchas.md` se o risco permanecer e valer como surpresa operacional.

### Feature nova

1. Criar/atualizar US em `docs/ust.md`.
2. Definir RF/RNF em `docs/prd.md` quando mudar escopo.
3. Implementar tracer bullet: UI/API/domain/DB/task mínimo.
4. Engrossar casos de erro.
5. Validar e reconciliar docs.

### Refactor

1. Suíte verde antes.
2. Não mudar comportamento observável.
3. Commit pequeno por eixo.
4. Se surgir contrato novo, ADR.

### Dependência nova

1. Justificar em 2 linhas.
2. Checar licença e audit.
3. Preferir dependência server-only fora do bundle client.
4. Documentar gotcha se a lib tiver comportamento contraintuitivo.

## 5. Definition of Done

- [ ] Story/RF relacionado está claro ou bug está documentado.
- [ ] Teste novo/alterado cobre comportamento de risco.
- [ ] `bun run test` passa, ou falha remanescente está documentada com motivo.
- [ ] `bunx tsc --noEmit` passa.
- [ ] `bun run lint` passa sem warnings novos relevantes.
- [ ] `bun run build` passa quando mudança toca app, server, deps, Prisma ou Trigger.
- [ ] `bun audit` passa ou risco está em `docs/gotchas.md` ou ADR.
- [ ] Nenhum secret/token/senha foi logado.
- [ ] Docs foram reconciliados quando escopo, arquitetura ou risco mudou.

## 6. Pre-Push Validation

Antes de push/release:

```sh
bun run test
bunx tsc --noEmit
bun run lint
bun run build
bun audit
```

Falhou: corrigir ou registrar explicitamente o bloqueio. Não enviar "meio verde" sem combinar.

## 7. Commits

- Usar Conventional Commits.
- Header até 72 caracteres quando possível.
- Um commit = uma mudança coerente.
- Referenciar US/RF quando aplicável: `feat(search): US-002 start visual search`.
- Docs podem ter commits próprios: `docs(arch): adapt AFM to Next tRPC`.

---

Mudanças neste método que alterem regra dura exigem ADR ou aprovação explícita do dono do projeto.
