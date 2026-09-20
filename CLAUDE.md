## Code style

- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any`, no `Dict`, no untyped functions.
- Zod: use v4 APIs exclusively (`z.email()`, `z.uuid()`, etc.).
  Never use deprecated v3 chained methods (`z.string().email()`, `z.string().uuid()`).
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.

## Comments

- Keep your own comments. Don't strip them on refactor — they carry
  intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because
  of a specific bug or upstream constraint.

## Tests

- Tests run with a single command: `bun run test`.
- Every new function gets a test. Bug fixes get a regression test.
- Mock external I/O (API, DB, filesystem) with named fake classes,
  not inline stubs.
- Tests must be F.I.R.S.T: fast, independent, repeatable,
  self-validating, timely.

## Dependencies

- Inject dependencies through constructor/parameter, not global/import.
- Wrap third-party libs behind a thin interface owned by this project.

## Structure

- Follow the framework's convention Next.Js V15 (app router).
- Prefer small focused modules over god files.
- Predictable paths: src/server/features/{procedures|domains}, src/lib for global lib, src/server/lib for server libs, etc.

## Formatting

- Use the language default formatter `biome`. Don't discuss style beyond that.

## Logging

- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.

## AFM

- Canonical AFM adopted from the `afm` plugin retroactively on 2026-08-31
  (plugin v3.5.0-rc.1, recorded in `docs/.afm-version`). The pre-existing
  hand-adapted docs (see ADR-0001) are the source of truth and were kept
  as-is; adoption only added the version marker, `docs/rubrics/`, and
  `afm.md` § 3.1.
- Canonical process lives in `docs/afm.md` (§ 3 hard rules + § 3.1 forward-only).
- Use `docs/prd.md` for product scope, `docs/ust.md` for user stories,
  `docs/ach.md` for architecture, `docs/gotchas.md` for known traps,
  `docs/rubrics/` for decision tables (SOLID, error classification, when to
  create lib/module/DSL, validation boundary), and `docs/adr/` for
  architectural decisions.
- Default loop: read the relevant docs first, understand the change in 2
  sentences, write or update a test for behavior changes, implement the
  smallest fix, refactor only after green, then validate with
  `bun run test`, `bunx tsc --noEmit`, `bun run lint`, `bun run build`, and
  `bun audit` when the change touches runtime or dependencies.
- Keep tasks small. If a change crosses boundaries or alters contracts,
  document the decision in an ADR before or alongside the code change.
- Prefer the existing stack and folder layout in this repo:
  Next.js App Router, tRPC, Prisma/Postgres, Redis, Stripe, Cloudinary,
  and Trigger.dev.

## Project Context

Read `docs/IDEA.md` for historical context, then `docs/prd.md` and
`docs/ust.md` for the current product contract. When in doubt about a
feature or direction, consult `docs/ach.md` and `docs/afm.md` first.
