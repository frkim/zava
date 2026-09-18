# Code Review — Zava E-commerce Simulation

> Date: 2026-06-03
> Scope: Backend (`src/Zava.Api`, .NET 10 Minimal API), Frontend (`src/Zava.Web`, React 19 + TypeScript), Infrastructure (`infra/*.bicep`), CI (`.github/workflows/deploy.yml`) and Dockerfiles.

This document is the result of a manual code review aimed at verifying that the
source code follows commonly accepted best practices and recommendations. Each
finding is rated with a **Risk** (impact if left unaddressed) and a
**Complexity** (effort required to fix). Recommendations are then summarised in a
single table **ordered by Risk (high → low), then by Complexity (low → high)** so
that the highest-value, lowest-effort actions can be tackled first.

> **Context note:** Zava is explicitly a *demonstration / simulation* project
> (in-memory data, deterministic `Random(42)` seed, fake payment flow). Several
> findings below are acceptable trade-offs for a demo but are still listed so the
> team can make an informed decision before any production use.

## Rating scales

| Risk | Meaning |
|------|---------|
| 🔴 High | Security exposure, data loss, or incorrect behaviour for real users |
| 🟠 Medium | Reliability / maintainability problem, or latent bug |
| 🟡 Low | Polish, consistency, minor robustness |

| Complexity | Meaning |
|------------|---------|
| Low | Localised change, < ~1 hour |
| Medium | Touches a few files / needs a small design decision |
| High | Cross-cutting change, new infrastructure, or architectural work |

---

## Recommendations summary (ordered by Risk, then Complexity)

| # | Area | Finding | Risk | Complexity |
|---|------|---------|------|------------|
| 1 | Backend | CORS reads a config key (`AllowedOrigins`) that does not exist in `appsettings.json` (which defines `Cors:Origins`); configured origins are silently ignored | 🔴 High | Low |
| 2 | Frontend | Raw payment credentials (card number/CVV, PayPal e-mail & password) are held in client state and POSTed in clear text | 🔴 High | Medium |
| 3 | Infra | Container Registry uses `adminUserEnabled: true` and admin password as a secret instead of a managed identity | 🔴 High | Medium |
| 4 | Backend | Mutable singleton `DataStore` is mutated by request handlers without locking → race conditions under concurrency | 🔴 High | Medium |
| 5 | Backend | A single global `Cart`/`User` is shared by every client (no per-session state) | 🔴 High | High |
| 6 | Backend | No global exception handling / `ProblemDetails`; unhandled errors leak stack traces | 🟠 Medium | Low |
| 7 | Backend | `DateTime.Now` used for persisted timestamps instead of `DateTime.UtcNow` | 🟠 Medium | Low |
| 8 | Docker | Container runs as `root`; no non-root `USER` and no `HEALTHCHECK` | 🟠 Medium | Low |
| 9 | Frontend | Pervasive `catch { /* ignore */ }` swallows errors with no logging or user feedback | 🟠 Medium | Medium |
| 10 | Repo | No automated tests anywhere (no test project, no JS test runner) | 🟠 Medium | High |
| 11 | Backend | Unvalidated request DTOs (negative price/quantity/stock, missing required fields) | 🟠 Medium | Medium |
| 12 | Backend | `int.Parse` on a filename segment in the product-image endpoint can throw | 🟡 Low | Low |
| 13 | Backend | `UseStaticFiles()` is registered twice in `Program.cs` | 🟡 Low | Low |
| 14 | Frontend | No HTTP security headers (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`) in `nginx.conf` | 🟡 Low | Low |
| 15 | Frontend | `localStorage` access in `LanguageContext` is not guarded against exceptions | 🟡 Low | Low |
| 16 | Backend | `JsonExporter` / dev-only seeding utilities shipped in the main assembly | 🟡 Low | Low |

---

## Detailed findings

### 1. CORS configuration key mismatch — 🔴 High / Low
`Program.cs` builds the CORS policy from the `AllowedOrigins` configuration
section:

```csharp
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173", /* ... */];
```

However `appsettings.json` declares the origins under a **different** key:

```json
"Cors": { "Origins": [ "http://localhost:5173", "http://localhost:5174" ] }
```

Because the keys do not match, `Get<string[]>()` always returns `null` and the
code silently falls back to the hard-coded localhost list. Any operator who edits
`appsettings.json` to allow their production frontend origin will find it has **no
effect**, and the API will reject the real frontend in production.

**Recommendation:** Make the code and configuration agree — e.g. read
`GetSection("Cors:Origins")` — and add a production origin (driven by
configuration / environment variable) rather than relying on the localhost
fallback.

### 2. Payment credentials handled in clear text — 🔴 High / Medium
`src/Zava.Web/src/pages/CheckoutPage.tsx` keeps `cardNumber`, `cardCvv`,
`cardExpiry`, and even a `paypalPassword` in React state and sends them to the
backend (`/api/checkout`). The backend (`Program.cs`) inspects
`req.CardNumber` directly. Even for a simulation this normalises an unsafe
pattern (PII/PCI data flowing through application state and logs).

**Recommendation:** Never collect a real CVV/PayPal password; for the demo, send
only a tokenised/last-4 representation, clearly label the form as simulated, and
ensure these fields are never logged. For any real integration, delegate to a PCI
provider (Stripe/Adyen) and never let raw PAN/CVV touch your servers.

### 3. ACR admin user enabled — 🔴 High / Medium
`infra/modules/container-registry.bicep` sets `adminUserEnabled: true`, and
`container-app.bicep` consumes `listCredentials()` to store the registry password
as a Container App secret. Admin credentials are long-lived shared secrets.

**Recommendation:** Disable the admin user and grant the Container App a
**managed identity** with the `AcrPull` role on the registry. This removes the
stored password secret entirely.

### 4. Unsynchronised mutation of a singleton store — 🔴 High / Medium
`DataStore` is registered as a singleton and exposes mutable `List<>`
collections. Request handlers mutate them directly (e.g. `store.Products.Add`,
`store.Cart.Items.Add`, `store.Orders.Add`). The `_lock` is only used inside
`Initialize`, so concurrent requests can corrupt the lists (e.g.
`List<T>` is not thread-safe; `Max(p => p.Id) + 1` is also a check-then-act race
that can produce duplicate IDs).

**Recommendation:** Protect all read/write access with the existing lock (or use
concurrent collections), and generate IDs atomically (e.g.
`Interlocked.Increment`).

### 5. Global shared Cart/User — 🔴 High / High
There is exactly one `Cart` and one `User` for the whole process. Every browser
shares the same basket and profile. This is a fundamental limitation for any
multi-user scenario and compounds finding #4.

**Recommendation:** Scope cart/user state per session (cookie/session id) or per
authenticated user. This is architectural and should be planned deliberately; for
a pure single-user demo it can be documented as a known limitation.

### 6. No global error handling — 🟠 Medium / Low
There is no `app.UseExceptionHandler` / `AddProblemDetails`. An unexpected
exception returns a default 500 that, outside Production, can include stack
traces; the frontend surfaces raw error text to users (`api.ts`).

**Recommendation:** Add `builder.Services.AddProblemDetails()` and
`app.UseExceptionHandler()` to return consistent, sanitised error payloads.

### 7. `DateTime.Now` for stored timestamps — 🟠 Medium / Low
Orders, products and tracking numbers use `DateTime.Now` (server local time),
e.g. `CreatedAt = DateTime.Now` and `TrackingNumber = $"ZV{DateTime.Now:...}"`.
Analytics then compares against `DateTime.Now.AddDays(-30)`. Local time makes
behaviour host-timezone-dependent and breaks across daylight-saving boundaries.

**Recommendation:** Use `DateTime.UtcNow` consistently (convert to local only for
display).

### 8. Container runs as root, no health check — 🟠 Medium / Low
`src/Zava.Api/Dockerfile` (and the web Dockerfile) do not set a non-root `USER`
and define no `HEALTHCHECK`. Running as root increases blast radius if the
container is compromised.

**Recommendation:** Add a non-root user (the .NET images ship `app` user) and a
`HEALTHCHECK`, and pin to released (non-`preview`) base images once available.

### 9. Errors silently swallowed in the frontend — 🟠 Medium / Medium
Many components use `catch { /* ignore */ }` (e.g. `SiteContext.tsx`,
`Layout.tsx`, `CartPage.tsx`, `SettingsPage.tsx`, `SearchPage.tsx`). Failures
produce neither logs nor user feedback, making issues invisible in production.

**Recommendation:** Centralise API error handling, log failures, and show a
user-visible error/toast. Consider an error boundary at the app root.

### 10. No automated tests — 🟠 Medium / High
There is no test project for the API and no JS test runner configured
(`package.json` has only `dev`/`build`/`lint`/`preview`). Regressions in search,
cart, checkout and analytics logic cannot be caught automatically.

**Recommendation:** Add an xUnit project for the API (cover `SearchService`,
`AnalyticsService`, checkout and cart endpoints) and Vitest + React Testing
Library for the frontend; wire both into CI.

### 11. Missing input validation on request DTOs — 🟠 Medium / Medium
Endpoints trust incoming DTOs. `CreateProductRequest` accepts negative `Price`
or `Stock` and empty `Name`/`Brand`; `AddToCartRequest`/`UpdateCartItemRequest`
accept arbitrary quantities; `CheckoutRequest` does no address validation.

**Recommendation:** Validate inputs (data annotations + minimal-API filter, or a
library such as FluentValidation) and return `400 ProblemDetails` on failure.

### 12. `int.Parse` on a filename segment can throw — 🟡 Low / Low
In `GET /api/products/{id}` the image discovery code does
`int.Parse(fileName.Split('_')[0])`. A stray file not matching the
`<n>_main.jpg` convention would throw an unhandled `FormatException`.

**Recommendation:** Use `int.TryParse` and skip files that do not match.

### 13. `UseStaticFiles()` registered twice — 🟡 Low / Low
`Program.cs` calls `app.UseStaticFiles()` at line ~43 and again near the SPA
fallback (~458). The duplicate is redundant.

**Recommendation:** Keep a single registration before the endpoint mappings.

### 14. Missing HTTP security headers — 🟡 Low / Low
`src/Zava.Web/nginx.conf` sets no `Content-Security-Policy`,
`X-Content-Type-Options: nosniff`, `X-Frame-Options`, or `Strict-Transport-Security`.

**Recommendation:** Add the standard security headers in the nginx config.

### 15. Unguarded `localStorage` access — 🟡 Low / Low
`src/Zava.Web/src/context/LanguageContext.tsx` reads/writes `localStorage`
without a `try/catch`; in private-mode browsers or when storage is full this
throws and can break rendering.

**Recommendation:** Wrap access in a small helper with `try/catch`.

### 16. Dev-only seeding utilities in the main assembly — 🟡 Low / Low
`Services/Seeders/JsonExporter.cs` and the per-category seeders are bundled in
the shipped API assembly. They are harmless but add surface area and load JSON
from disk at runtime.

**Recommendation:** Keep seed data as embedded resources or move export tooling
into a separate dev-only project/target.

---

## Positive observations

- Clean, idiomatic Minimal API with clear endpoint grouping and nullable reference
  types enabled (`<Nullable>enable</Nullable>`).
- Good separation of concerns: `DataStore`, `SearchService`, `AnalyticsService`,
  and per-site seeders.
- Deterministic seed (`Random(42)`) makes demo data reproducible.
- Search pagination correctly clamps `PageSize` (`Math.Clamp(..., 1, 100)`) and
  `Page` (`Math.Max(1, ...)`), avoiding obvious abuse.
- Multi-stage Dockerfiles and Container Apps ingress with `allowInsecure: false`.

## Suggested order of work

1. **Quick high-value fixes (Low complexity, High/Medium risk):** #1 (CORS key),
   #6 (global error handling), #7 (UTC), #8 (non-root container).
2. **Hardening (Medium complexity):** #2 (payment data), #3 (managed identity),
   #4 (locking), #9 (frontend error handling), #11 (validation).
3. **Foundational investment (High complexity):** #5 (per-session state) and
   #10 (test coverage in CI).
