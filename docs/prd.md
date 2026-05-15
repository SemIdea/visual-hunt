<!--
afm:state=bootstrapped
Fonte inicial: docs/IDEA.md + estado atual do código em src/app, src/server e src/trigger.
Mudanças de escopo passam por atualização deste arquivo e de docs/ust.md.
-->

# PRD — Visual Hunt

> Product Requirements Document. Documento vivo — editar in-place.
> Mudanças de escopo passam pelo dono do produto antes do merge.

## 1. Resumo

Visual Hunt é um SaaS de busca visual reversa para investigadores e entusiastas de OSINT. O usuário envia uma imagem uma vez, o sistema armazena a entrada em uma URL pública temporária, dispara uma busca visual via provedores externos e consolida os resultados em uma interface única com histórico.

Proposta de valor em uma frase: *"Faça uma busca reversa uma vez e acompanhe resultados consolidados sem repetir upload em múltiplos buscadores."*

## 2. Problema & Oportunidade

- **Dor observada:** investigadores de OSINT repetem upload e consulta manual em buscadores de imagem diferentes, depois consolidam links, thumbnails e fontes manualmente.
- **Por que agora:** APIs terceiras como ScrapingDog/Google Lens, storage gerenciado como Cloudinary e jobs assíncronos com Trigger.dev reduzem o custo operacional de orquestrar buscas visuais.
- **Tamanho do ganho:** reduzir trabalho repetitivo de múltiplas abas para um único fluxo rastreável com status, histórico e resultado consolidado.

## 3. Usuário-alvo & Jobs-to-be-done

**Persona primária:** investigador OSINT solo, jornalista investigativo, analista de segurança ou entusiasta que precisa rastrear origem, variações ou contexto de uma imagem.

**Usuários típicos:**
- Investigadores que já usam Google Images, Lens, TinEye, Yandex ou extensões de browser e querem economizar repetição.
- Analistas que precisam guardar histórico de buscas e revisitar resultados.

**Jobs-to-be-done:**
- Quando recebo uma imagem suspeita, quero fazer upload uma vez para encontrar possíveis origens, cópias e páginas relacionadas.
- Quando uma busca demora, quero acompanhar status e acessar o resultado depois sem perder o contexto.
- Quando encontro resultados, quero saber a fonte/provedor de cada item para avaliar confiança e seguir a investigação.

**Cenários típicos:**
- "Recebi uma imagem sem contexto e preciso descobrir onde ela apareceu antes."
- "Quero comparar rapidamente resultados retornados por provedores diferentes conforme eles forem adicionados."

## 4. Requisitos Funcionais

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-01 | Usuário pode criar conta, login, logout e refresh de sessão. | P0 |
| RF-02 | Usuário autenticado pode iniciar busca visual a partir de uma URL pública de imagem ou upload que gere URL pública. | P0 |
| RF-03 | Sistema persiste busca com status, `jobId`, token público de leitura do run e vínculo ao usuário. | P0 |
| RF-04 | Sistema executa busca assíncrona via Trigger.dev e provedor Google Lens/ScrapingDog. | P0 |
| RF-05 | Usuário pode abrir uma busca e ver status, imagem fonte e resultados persistidos. | P0 |
| RF-06 | Usuário pode ver histórico de buscas e apagar buscas próprias. | P1 |
| RF-07 | Sistema integra Stripe para checkout e assinatura do usuário. | P1 |
| RF-08 | Futuramente, sistema deve suportar múltiplos provedores de ISE e identificar a fonte de cada resultado. | P2 |
| RF-09 | Futuramente, usuário pode filtrar resultados por fonte, similaridade, data ou domínio. | P2 |

## 5. Requisitos Não-Funcionais

| ID | Tipo | Critério |
| --- | --- | --- |
| RNF-01 | Segurança | Tokens de sessão são persistidos apenas como hash; secrets não são logados; `.env` não é versionado. |
| RNF-02 | Segurança | Busca e histórico são isolados por `userId`; usuário não pode ler/apagar busca de outro usuário sem token público específico. |
| RNF-03 | Resiliência | Tasks Trigger.dev devem ser idempotentes: retry não duplica resultados nem sobrescreve rastreadores imutáveis sem necessidade. |
| RNF-04 | Observabilidade | Cada busca persiste `jobId` e `publicAccessToken` para acompanhamento do run. |
| RNF-05 | Operação | Build de produção não deve exigir conexão ativa com Stripe/Redis até o recurso ser usado em runtime. |
| RNF-06 | Qualidade | `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build` e `npm audit` devem passar antes de release. |

## 6. Metas por Etapa

### 6.1 MVP — busca visual end-to-end autenticada

**Objetivo:** um usuário autenticado consegue iniciar uma busca visual, acompanhar processamento assíncrono e ver resultados salvos depois.

**Escopo mínimo:** RF-01, RF-02, RF-03, RF-04 e RF-05.

**Fora do MVP:** múltiplos provedores simultâneos, filtros avançados, app mobile, scraping direto sem API, gestão completa de billing em produção.

**Critério de aceite:**
1. Criar conta ou fazer login.
2. Enviar uma imagem/URL válida pela home.
3. Criar registro `Search` com status inicial e `jobId`.
4. Task processar provedor externo e persistir resultados ou status terminal.
5. Página `/search/[id]` exibir status e resultados sem erro.

**Métrica de sucesso:** pelo menos 80% das buscas válidas em ambiente de teste chegam a `COMPLETED` ou `EMPTY` sem intervenção manual.

### 6.2 GTM — design partners OSINT

**Objetivo:** colocar o fluxo em uso por poucos usuários reais e aprender quais provedores/resultados importam.

**Posicionamento:** *"Reverse image search workflow for OSINT operators."* Foco em investigadores que já usam busca reversa manualmente.

**Escopo adicional:** histórico usável, remoção de busca, billing inicial, melhores estados de erro e documentação operacional de Stripe/Trigger/Cloudinary.

**Métrica de sucesso:** usuários voltam para consultar histórico e pelo menos 3 design partners executam buscas recorrentes em uma semana.

### 6.3 First N — sustentabilidade operacional

**Objetivo:** operar buscas pagas sem intervenção manual e com custos externos controlados.

**Escopo adicional:** quotas por plano, rate limiting por usuário/plano, múltiplos provedores, retries auditáveis, alertas de falha e runbooks.

**Guardrails:** audit sem vulnerabilidades conhecidas acionáveis, nenhum secret em logs, falhas de provedor externo não derrubam o app.

## 7. Métricas & North Star

**North Star:** **buscas concluídas com resultado revisável** — uma busca conta quando termina em estado terminal e pode ser aberta novamente pelo usuário.

**Input metrics:**
- Buscas iniciadas por usuário ativo.
- Percentual de buscas com status terminal.
- Tempo médio de `PENDING` até `COMPLETED`/`EMPTY`/`FAILED`.
- Cliques em resultados externos.

**Guardrails:**
- Taxa de falha por provedor.
- Custo médio por busca.
- Erros de autenticação/checkout.
- Vulnerabilidades do `npm audit`.

## 8. Riscos & Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
| --- | --- | --- | --- |
| APIs de busca visual mudam contrato, rate limit ou preço. | Alto | Alto | Encapsular provedores em `src/trigger/lib/*`, registrar falhas por fonte e adicionar fallback por provedor. |
| Resultados de busca podem ser sensíveis. | Alto | Médio | Isolar por usuário, evitar logs de URLs privadas e definir retenção antes de produção. |
| Trigger.dev ou dependências transitivas exigem override de segurança. | Médio | Médio | Manter `npm audit` limpo e revisar releases oficiais para remover overrides. |
| Cloudinary pode não importar algumas URLs remotas. | Médio | Médio | Suportar upload direto confiável e tratar erro de importação com mensagem clara. |

## 9. Não-Escopo v1

- **Scraping direto sem API.** A v1 usa provedores externos para reduzir risco operacional.
- **Múltiplas ISEs em paralelo.** O desenho deve permitir, mas a primeira versão pode começar com Google Lens/ScrapingDog.
- **Filtros avançados.** Resultado bruto e fonte vêm antes de ranking sofisticado.
- **App mobile.** Web responsivo é suficiente para validar o fluxo.
- **Busca anônima.** ADR-0002 define busca autenticada para o MVP; qualquer mudança exige nova ADR.

## 10. Glossário

- **ISE** — Image Search Engine, buscador de imagens como Google Lens, TinEye, Yandex ou Bing.
- **Busca visual reversa** — tentativa de encontrar páginas, cópias ou imagens relacionadas a partir de uma imagem de entrada.
- **Search** — entidade persistida que representa uma busca iniciada por usuário.
- **Result** — item retornado por um provedor e vinculado a uma Search.
- **Provider** — integração externa que executa a busca visual.
- **Run** — execução assíncrona no Trigger.dev.

## 11. Naming

- **Produto user-facing:** "Visual Hunt".
- **Identificadores técnicos estáveis:** `visual-hunt`, `Search`, `Result`, `Session`, `Subscription`, `start-search`.
- **Termo preferido na UI:** "search" em inglês, mantendo consistência com rotas e entidades atuais.

---

Estado vivo em `docs/ust.md` (stories), `docs/ach.md` (arquitetura), `docs/BUGS.md` (riscos conhecidos) e `docs/adr/` (decisões).
