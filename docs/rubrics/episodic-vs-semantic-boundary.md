# Rubrica — fronteira episódico vs semântico (o que decai vs o que é permanente)

> Materializa o princípio invariante #1 ("se outro agente sem minha memória precisa saber, é doc") na dimensão **temporal**: nem todo artefato de `/docs/` é conhecimento permanente. v3.1.0+ (Fase 3 da iniciativa v3.2). Ancestral: CoALA (arXiv 2309.02427) — memória **episódica** (o que aconteceu) ≠ **semântica** (o que se sabe) ≠ **procedural** (como se faz).

## Os tiers no AFM

| Tier | O que é | Onde vive | Decai? | Entra nos eixos A1–A7 do diagnose? |
|---|---|---|---|---|
| **Semântico** | conhecimento durável: regras, arquitetura, decisões, surpresas | `afm.md`, `ach.md`, `prd.md`, `ust.md`, `gotchas.md`, `adr/`, `learnings/`, `rubrics/` | **Não** — supersedeável (ADR Substituída, tombstone), nunca apaga | **Sim** |
| **Procedural** | sequências repetíveis | `procedures/` | frequência/staleness (`restructure`) | Sim (cobertura herdada) |
| **Episódico** | o que aconteceu numa sessão: estado de trabalho, handoff | bloco de handoff de `sessions/`, `_focus.md` (foco atual) | **Sim** — handoff `open` envelhecido decai (A2); `_focus` é OVERWRITE | **NÃO** (é estado, não conhecimento) |
| **Telemetria** | log append-only de eventos/falhas · **uso real da metodologia** | `.afm-log/`, `.afm-log-failures/` · **timeline e `afm_findings` de `sessions/`** | só por rotação/retenção; auditoria = git | **NÃO** (append-only) |

> **`sessions/` é dual-tier** (v4/F9). O mesmo arquivo carrega os dois: o **bloco de handoff** decai (`state: open|consumed` governa **só ele** — `consumed` significa "já foi lido", nunca "arquivo morto") e a **telemetria** não decai (o que foi pedido · como o AFM foi usado · `afm_findings`). É versionado e viaja: é o que um agente do repo do plugin lê pra melhorar o AFM a partir de uso real. A exclusão da regra 17 continua valendo por path fechado — o arquivo é append-por-sessão, nunca reescrito.

## Critério (decisão)

- **É conhecimento que outro agente sem minha memória precisa pra não quebrar?** → **semântico** (permanente, entra no diagnose, nunca decai sozinho). É o #1.
- **É "onde eu estava" / "o que aconteceu nesta sessão"?** → **episódico** (decai, fica fora do diagnose). Dar permanência a isso infla o diagnose com ruído.
- **Promoção episódico → semântico** é o ponto do `reconcile`: quando um episódio revela uma decisão/regra/gotcha load-bearing, propõe materializar no tier semântico (gate humano, #6). O episódio é o **buffer** de onde a evolução pesca candidatos; não é a evolução.

## Anti-padrões

- ❌ **Tratar handoff/`_focus` como doc normativo** — infla o diagnose (A1–A7) com estado volátil. São episódicos.
- ❌ **Ler `state: consumed` como "arquivo pode sumir"** — `state` governa só o bloco de handoff. A telemetria da mesma sessão continua viva e versionada.
- ❌ **Decair conhecimento semântico** — regra/decisão/gotcha não decai por idade; supersede (ADR) ou consolida (`generalize`), nunca apaga por tempo (#5: memória institucional).
- ❌ **`_focus.md` que cresce** — é estado pequeno e sobrescrito (regra 20), não um log.
- ❌ **Promover episódio a semântico sem cruzar o #1** — nem todo "o que aconteceu" é "o que outro precisa saber".
