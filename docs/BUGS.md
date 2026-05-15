# Bugs e Riscos Conhecidos

## Critico

- **Fluxo de busca duplicado historicamente**: ainda existem nomes de compatibilidade (`searchWithUrl`, `readSearchWithResults`) junto do fluxo novo `startSearch`. A implementacao foi alinhada para usar a task `start-search`, mas o produto deveria escolher um contrato publico unico depois.
- **Search exige usuario autenticado**: buscas criam registros vinculados ao usuario. A home agora redireciona para login quando nao ha sessao, mas ainda falta uma decisao de produto sobre busca anonima.

## Alto

- **Trigger.dev v4 depende de overrides de seguranca transitivos**: o audit esta limpo com overrides para `cookie` e `systeminformation`, mas uma atualizacao oficial do Trigger deve ser revisada quando houver release que resolva isso sem override.
- **Docker de producao nao executa migracoes**: o container nao roda `prisma db push` no start. Isso evita mutacao automatica em producao, mas exige pipeline de migracao separado.

## Medio

- **README ainda nao cobre todos os fluxos externos**: ha envs documentadas, mas faltam instrucoes operacionais detalhadas para webhooks Stripe, Trigger deploy e presets Cloudinary.
- **Upload via URL passa pelo Cloudinary antes da busca**: isso padroniza a entrada para a task, mas pode falhar para URLs remotas que o Cloudinary nao consiga importar.
