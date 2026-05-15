<!--
afm:state=bootstrapped
Backlog inicial derivado de docs/IDEA.md, docs/prd.md e estado atual do código.
-->

# UST — User Stories

> Backlog vivo de stories. Toda feature/mudança nova nasce como uma US.
> Status flui: `draft` -> `ready` -> `in_progress` -> `done` ou `cancelled`.

## Convenções

- **ID:** `US-NNN` (3 dígitos, zero-padded).
- **Referência cruzada:** sempre por ID (`RF-NN`, `RNF-NN`, `US-NNN`).
- **Critérios:** Gherkin (`Given/When/Then`). 1+ cenário por US.
- **Status:** atualizado in-place no commit que muda o estado real.
- **Definition of Ready:** persona, dor, critérios e dependências preenchidos.

## Sumário

| ID | Título | Categoria | Prioridade | Status |
| --- | --- | --- | --- | --- |
| US-001 | Criar conta e iniciar sessão | Auth | P0 | done |
| US-002 | Iniciar busca visual autenticada | Search | P0 | in_progress |
| US-003 | Acompanhar status e ver resultados | Search | P0 | in_progress |
| US-004 | Consultar e gerenciar histórico | Search | P1 | in_progress |
| US-005 | Assinar plano pago via Stripe | Billing | P1 | in_progress |
| US-006 | Adicionar novo provedor de busca visual | Providers | P2 | draft |

---

## Épico Auth

### US-001 — Usuário cria conta e inicia sessão

- **Persona:** investigador OSINT que quer manter histórico e resultados privados.
- **Dor:** sem conta, o usuário perde buscas anteriores e não há como isolar resultados.
- **Story:** Como usuário, quero criar conta, fazer login e manter uma sessão para acessar minhas buscas.

**Critérios de aceitação:**

```gherkin
Scenario: Registro com dados válidos
  Given um visitante sem sessão
  When ele informa nome, email válido e senha com pelo menos 8 caracteres
  Then uma conta é criada
  And uma sessão autenticada é emitida
```

```gherkin
Scenario: Email já cadastrado
  Given já existe usuário com o mesmo email
  When o visitante tenta registrar novamente
  Then a API retorna conflito
  And nenhuma nova conta é criada
```

```gherkin
Scenario: Login válido
  Given existe usuário com senha cadastrada
  When ele informa email e senha corretos
  Then a API retorna access token e refresh token
  And a sessão pode ser consultada por auth.me
```

**Metadata:**
- **Prioridade:** P0
- **Status:** done
- **RF:** RF-01
- **RNF:** RNF-01, RNF-02
- **Métrica de sucesso:** usuário autenticado consegue abrir a home/dashboard sem erro de sessão.
- **Dependências:** Prisma, Redis, bcrypt, token helpers.

---

## Épico Search

### US-002 — Usuário inicia busca visual autenticada

- **Persona:** investigador OSINT autenticado.
- **Dor:** repetir upload em vários buscadores é lento e difícil de rastrear.
- **Story:** Como usuário autenticado, quero enviar uma imagem ou URL pública para iniciar uma busca visual e receber um identificador rastreável.

**Critérios de aceitação:**

```gherkin
Scenario: Busca criada com URL válida
  Given um usuário autenticado
  And uma URL pública de imagem válida
  When ele inicia a busca
  Then uma Search é criada vinculada ao seu userId
  And um job Trigger.dev é disparado
  And a Search armazena jobId e publicAccessToken
```

```gherkin
Scenario: Visitante tenta iniciar busca
  Given um visitante sem sessão
  When ele tenta iniciar uma busca
  Then a API retorna UNAUTHORIZED
  And nenhuma Search é criada
```

**Metadata:**
- **Prioridade:** P0
- **Status:** in_progress
- **RF:** RF-02, RF-03
- **RNF:** RNF-02, RNF-04
- **Métrica de sucesso:** buscas válidas criam row em `Search` e run em Trigger.dev.
- **Dependências:** Cloudinary/upload client, tRPC search router, Trigger.dev.

### US-003 — Usuário acompanha status e vê resultados

- **Persona:** investigador OSINT aguardando resposta da busca.
- **Dor:** buscas externas demoram e podem retornar vazio/falha; o usuário precisa saber o estado.
- **Story:** Como usuário, quero abrir uma busca e ver status, imagem fonte e resultados consolidados.

**Critérios de aceitação:**

```gherkin
Scenario: Busca concluída com resultados
  Given uma Search existente com resultados persistidos
  When o usuário abre /search/[id]
  Then a página mostra a imagem fonte
  And lista resultados com título, link, thumbnail, posição e fonte
```

```gherkin
Scenario: Busca ainda em processamento
  Given uma Search com status PENDING ou PROCESSING
  When o usuário abre a página da busca
  Then a interface mostra estado de processamento
  And não quebra se results estiver vazio
```

```gherkin
Scenario: Busca sem resultados
  Given a task terminou sem resultados
  When o usuário abre a busca
  Then o status EMPTY é representado claramente
  And não há resultados duplicados
```

**Metadata:**
- **Prioridade:** P0
- **Status:** in_progress
- **RF:** RF-04, RF-05
- **RNF:** RNF-03, RNF-04
- **Métrica de sucesso:** usuário consegue revisitar busca em estado terminal sem acionar novo job.
- **Dependências:** Trigger task `start-search`, provider ScrapingDog/Google Lens, Prisma Result.

### US-004 — Usuário consulta e gerencia histórico

- **Persona:** investigador OSINT que faz buscas recorrentes.
- **Dor:** sem histórico, cada investigação perde contexto.
- **Story:** Como usuário autenticado, quero listar e apagar minhas buscas anteriores para organizar minha investigação.

**Critérios de aceitação:**

```gherkin
Scenario: Histórico lista apenas buscas do usuário
  Given existem buscas de múltiplos usuários
  When um usuário autenticado abre o dashboard
  Then ele vê apenas buscas vinculadas ao seu userId
```

```gherkin
Scenario: Remover busca própria
  Given uma Search pertence ao usuário autenticado
  When ele solicita exclusão
  Then a Search e seus Results são removidos
  And ela não aparece mais no histórico
```

```gherkin
Scenario: Remover busca de outro usuário
  Given uma Search pertence a outro usuário
  When o usuário autenticado solicita exclusão
  Then a API retorna NOT_FOUND ou FORBIDDEN
  And a Search original permanece intacta
```

**Metadata:**
- **Prioridade:** P1
- **Status:** in_progress
- **RF:** RF-06
- **RNF:** RNF-02
- **Métrica de sucesso:** histórico não vaza dados entre usuários.
- **Dependências:** Dashboard, tRPC protected procedures.

---

## Épico Billing

### US-005 — Usuário assina plano pago via Stripe

- **Persona:** usuário recorrente que precisa de limite maior ou acesso contínuo.
- **Dor:** sem billing, não há como controlar custo de APIs externas.
- **Story:** Como usuário autenticado, quero iniciar checkout Stripe e ter minha assinatura refletida no app.

**Critérios de aceitação:**

```gherkin
Scenario: Criar sessão de checkout
  Given um usuário autenticado
  When ele escolhe um plano válido
  Then a API cria uma checkout session no Stripe
  And retorna a URL de checkout
```

```gherkin
Scenario: Webhook de assinatura concluída
  Given Stripe envia checkout.session.completed com userId em metadata
  When o webhook é validado
  Then o usuário recebe stripeCustomerId
  And a Subscription é criada ou atualizada
```

**Metadata:**
- **Prioridade:** P1
- **Status:** in_progress
- **RF:** RF-07
- **RNF:** RNF-05
- **Métrica de sucesso:** assinatura ativa aparece em `auth.me`.
- **Dependências:** Stripe envs, webhook secret, Prisma Subscription.

---

## Épico Providers

### US-006 — Sistema adiciona novo provedor de busca visual

- **Persona:** investigador que precisa comparar pontos cegos de ISEs diferentes.
- **Dor:** um único buscador pode não encontrar imagem relevante.
- **Story:** Como usuário, quero que o sistema consulte múltiplos provedores e indique a fonte de cada resultado.

**Critérios de aceitação:**

```gherkin
Scenario: Novo provedor retorna resultados normalizados
  Given existe uma Search em processamento
  When o novo provedor termina
  Then seus resultados são persistidos no mesmo shape de Result
  And cada item identifica a fonte do provedor
```

```gherkin
Scenario: Provedor falha sem derrubar toda a busca
  Given múltiplos provedores estão configurados
  When um provedor falha
  Then a falha é registrada
  And resultados dos outros provedores continuam disponíveis
```

**Metadata:**
- **Prioridade:** P2
- **Status:** draft
- **RF:** RF-08, RF-09
- **RNF:** RNF-03, RNF-04
- **Métrica de sucesso:** adicionar provedor novo não exige alterar UI nem schema público de Result.
- **Dependências:** decisão de modelagem para status por provedor.

---

*Adicionar US nova: copiar um bloco existente, usar o próximo ID sequencial e atualizar o sumário no mesmo commit.*
