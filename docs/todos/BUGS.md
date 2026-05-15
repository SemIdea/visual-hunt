# Bugs e Riscos Conhecidos

## Status

Não há bug crítico conhecido aberto neste momento.

## Riscos Monitorados

- **Provider externo único no MVP:** Google Lens/ScrapingDog é o primeiro provider. Multi-provider está modelado como US-006 em `docs/ust.md`.
- **Status por provider ainda não existe:** quando US-006 avançar, avaliar model próprio para status parcial por provider.
- **Busca pública/compartilhável não existe:** ADR-0002 define busca autenticada. Compartilhamento público futuro exige token próprio, expiração e decisão de privacidade.

## Resolvidos

- **Log de credenciais no registro:** removido de `src/app/auth/register/_components/form/index.tsx`.
- **Aliases legados de busca:** removidos `searchWithUrl` e `readSearchWithResults`; UI usa `startSearch` e `getSearch`.
- **Leitura de busca por ID público:** `getSearch` agora exige sessão e filtra por `userId`.
- **Server caller sem sessão por cookie:** headers agora leem `vh_access_token` do cookie quando não há `Authorization`.
- **Falha de upload Cloudinary sem feedback:** upload da home agora captura erro e mostra mensagem antes de iniciar busca.
- **Docker produção sem migração:** target de produção roda `prisma migrate deploy` antes de `npm start`.
- **README incompleto para integrações externas:** runbooks mínimos de Stripe, Trigger.dev, Cloudinary e ScrapingDog foram adicionados.
- **Trigger.dev audit drift:** overrides necessários foram restaurados e `npm audit` voltou a ficar limpo.
