# RFC-001: Visual Hunt Production Refactor

**Status:** DRAFT
**Author:** Engineering
**Date:** 2026-04-12
**Target Branch:** `refactor/production-hardening`

---

## 1. Summary

Refactor Visual Hunt from a functional prototype to a production-grade application. The codebase has correct business intent but lacks the architectural discipline, security hardening, and observability required for production. This RFC proposes a phased refactor: architecture first, then business logic validation, then security hardening.

---

## 2. Motivation

### Current State

Visual Hunt is a reverse image search SaaS that integrates Google Lens (via SerpAPI/ScrapingDog), Stripe billing, and OAuth authentication. The application works end-to-end but has critical gaps:

- **No output validation** — API returns raw Prisma models, leaking sensitive fields (`stripeCustomerId`, `access_token`)
- **No rate limiting** — paid API calls and Stripe endpoints unthrottled
- **Multiple PrismaClient instances** — 4 separate connection pools (driver, auth, 2 trigger tasks)
- **Broken caching** — missing `await` on async cache reads makes every cache check return a Promise (always truthy), bypassing cache entirely
- **Plaintext secrets in DB** — OAuth tokens and trigger.dev public tokens stored unhashed
- **No centralized config** — `process.env` scattered across 8+ files with no validation
- **Over-engineered entity layer** — 4-generic BaseEntity with cache config, but 5/7 entities disable caching. Repository pattern wraps Prisma 1:1 with zero added logic

### Why Now

- Every API response is unvalidated — any DB schema change breaks the client silently
- `searchWithUrl` triggers paid external API calls with no throttle — one malicious user = cost spike
- The broken cache means every auth check hits the DB — won't scale past ~100 concurrent users
- Missing `await` bugs are silent — no errors, just wrong behavior

---

## 3. Proposed Solution

### Phase 1: Architecture Refactor (Foundation)

Restructure server code to match the procedure → domain pattern. This is the foundation all other phases depend on.

**Changes:**
- Replace entity/repository abstraction with domain functions
- Introduce centralized context with request-scoped data
- Add output validation schemas on every procedure
- Consolidate PrismaClient to a single global singleton
- Add `superjson` transformer to tRPC
- Centralize env config into one validated module

**Not changed:** Business logic stays the same. We're moving code, not rewriting it.

### Phase 2: Business Logic Validation

Audit and validate every business flow against product requirements.

**Changes:**
- Validate search creation flow (rate limits, quota enforcement)
- Validate Stripe webhook handling (retry on failure, idempotency)
- Validate auth flow (session caching, token rotation)
- Add missing business rules (search limit per plan, concurrent search limits)

### Phase 3: Security Hardening

Layer security on top of the now-clean architecture.

**Changes:**
- Hash all stored tokens (HMAC-SHA256)
- Encrypt OAuth tokens at rest (AES-256-GCM)
- Add rate limiting middleware (token-bucket on Redis)
- Add `server-only` / `client-only` boundaries
- Restrict `trustHost` to known domains
- Strip sensitive fields from API responses

---

## 4. Detailed Design

See [DD-001](../dd/001-production-refactor.md)

---

## 5. Alternatives Considered

### A. Incremental fixes without architecture change
Patch bugs one by one. **Rejected** — the entity/repository abstraction makes it hard to add output validation, rate limiting, or centralized config without touching every file. Better to restructure once.

### B. Full rewrite from scratch
Rebuild using neo-console patterns directly. **Rejected** — too much working business logic to throw away. The refactor preserves existing flows while fixing structure.

### C. Fix architecture and business logic simultaneously
**Rejected** — architecture changes affect every file. Mixing logic changes makes bugs impossible to attribute. Sequential phases = clear blame.

---

## 6. Migration Strategy

| Phase | Duration | Breaking Changes | Downtime |
|-------|----------|-----------------|----------|
| 1 — Architecture | 3-4 days | Yes (API output shape changes) | Zero (deploy behind feature flag or versioned route) |
| 2 — Business Logic | 2-3 days | No | Zero |
| 3 — Security | 2-3 days | Yes (token format changes) | Brief (DB migration for token hashing) |

Phase 1 and 2 can be deployed independently. Phase 3 requires a DB migration and token rotation.

---

## 7. Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Keep Prisma Accelerate? | **Yes** — keep Accelerate |
| 2 | Migrate from next-auth to custom auth? | **Later** — keep next-auth now. Custom auth planned as Phase 4 |
| 3 | ScrapingDog trigger task? | **Keep** — experimental, may use later |
| 4 | Quota tracking approach? | **Separate SearchQuota table** — atomic increments, clean monthly resets, queryable history |
| 5 | API versioning (`/api/v1/`)? | **No** — skip for now |

---

## 8. Success Criteria

- [ ] Every procedure has `.input()` and `.output()` schemas
- [ ] Rate limiting on all procedures (especially `searchWithUrl` and checkout)
- [ ] Single PrismaClient instance
- [ ] All cached reads use `await`
- [ ] No sensitive fields in API responses
- [ ] All tokens hashed before storage
- [ ] Centralized env config with validation
- [ ] Zero `console.error` in production paths (use structured logging)
- [ ] All tests passing (new test suite for domain functions)
