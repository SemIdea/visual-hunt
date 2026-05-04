# Auth — TODO

## Pendente: Registro de usuário

### Server

- [ ] `src/server/features/auth/schemas.ts`
      Adicionar `registerInputSchema` (`name: z.string().min(1).max(100)`,
      `email: z.string().email()`, `password: z.string().min(8).max(128)`).

- [ ] `src/server/features/auth/domains/register.ts`
      `domain_register`: valida email único, hashea senha, cria user com
      `passwordHash`, chama `domain_createSession` pra login automático.
      Tratar unique constraint violation como `CONFLICT`.

- [ ] `src/server/features/auth/procedures/register.ts`
      `procedure_register`: publicProcedure, input = `registerInputSchema`,
      chama `domain_register`, retorna `{ status, accessToken, refreshToken,
      expiresIn }`.

- [ ] `src/server/features/auth/router.ts`
      Adicionar `register: procedure_register`.

- [ ] `src/server/features/auth/domains/register.test.ts`
      Testes: sucesso (cria user + session), email duplicado, senha curta.

### Client

- [ ] `src/app/auth/register/page.tsx`
      Server component, renderiza form.

- [ ] `src/app/auth/register/_components/form/index.tsx`
      Client component: 3 campos (name, email, password), chama
      `trpc.auth.register.useMutation()`, redireciona pra dashboard.

- [ ] `src/app/auth/login/_components/form/index.tsx`
      Adicionar link "Criar conta" abaixo do botão de login.

- [ ] Atualizar header unauthenticated: link "Registrar" ao lado de "Entrar".
