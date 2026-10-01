# Code review — October 2026

Scope: the whole repository at commit `02731d4` — the .NET 10 API (`src/Zava.Api`), the React/Vite front end (`src/Zava.Web`), the infrastructure (`infra/`, Dockerfiles, `nginx.conf`, `azure.yaml`), the CI workflow (`.github/workflows/deploy.yml`), the scripts and the tests.

The review compares the code with common .NET, React, Azure and security practices. Zava is presented as a **demo store** (see [README › Évaluation qualité et priorités](../README.md#évaluation-qualité-et-priorités)). Each risk is rated twice: for the deployed demo, which is public on the Internet, and for any move towards real use.

## How to read this report

| Rating | Meaning |
|--------|---------|
| **Risk: High** | Exploitable today on the public deployment, or likely to ship a regression or a data/availability incident |
| **Risk: Medium** | Real weakness with a bounded impact, or one that needs specific conditions |
| **Risk: Low** | Hygiene, maintainability or latent issue with little user impact today |
| **Complexity: Low** | Local change, about ≤ ½ day, no design decision |
| **Complexity: Medium** | Several files or components, small design decision, about 1–3 days |
| **Complexity: High** | Changes the architecture or the product (identity, persistence, multi-instance) |

Recommendations are sorted **by risk (highest first), then by complexity (lowest first)**, so quick wins come first within each risk level.

## Verification performed

| Check | Result |
|-------|--------|
| `dotnet build Zava.slnx` | ✅ Succeeds; warning **NU1903**: `Microsoft.OpenApi` 2.0.0 (transitive) — [GHSA-v5pm-xwqc-g5wc](https://github.com/advisories/GHSA-v5pm-xwqc-g5wc), high severity |
| `dotnet run --project tests/Zava.Api.RecipeChecks` | ✅ `PASS` (all API, recipe and MCP checks) |
| `dotnet list package --vulnerable --include-transitive` | 1 vulnerable transitive package (`Microsoft.OpenApi` 2.0.0) |
| `dotnet list package --outdated` | `Microsoft.AspNetCore.OpenApi` 10.0.2 → 10.0.12, `Microsoft.ApplicationInsights.AspNetCore` 2.23.0 → 3.1.2 |
| `npm run lint` (Zava.Web) | ✅ 0 errors, ⚠️ 7 warnings `react-hooks/set-state-in-effect` |
| `tsc -b` + `vite build` | ✅ Succeeds; `AnalyticsPage` chunk is 1.14 MB (380 KB gzip), above Vite's 500 KB warning |
| `npm audit --package-lock-only` | 4 advisories in build-time dependencies (1 high `browserslist`, 2 moderate, 1 low) |

## Summary — recommendations ordered by risk, then complexity

| # | Recommendation | Area | Risk | Complexity |
|---|----------------|------|------|------------|
| [R1](#r1--add-a-quality-gate-to-ci-before-deploying-to-production) | Add a quality gate to CI before deploying to production | CI/CD | High | Low |
| [R2](#r2--protect-administrative-and-mutating-endpoints-on-the-public-deployment) | Protect administrative and mutating endpoints (`/api/config/*`, `POST /api/products`, `/mcp`) on the public deployment | Security | High | Medium |
| [R3](#r3--make-checkout-transactional-decrement-stock-validate-input-idempotency) | Make checkout transactional: decrement stock, validate input, add idempotency | Business logic | High | Medium |
| [R4](#r4--introduce-user-identity-per-user-state-and-persistence) | Introduce user identity, per-user state and persistence | Architecture | High | High |
| [R5](#r5--upgrade-microsoftaspnetcoreopenapi-to-fix-the-vulnerable-microsoftopenapi) | Upgrade `Microsoft.AspNetCore.OpenApi` to fix the vulnerable `Microsoft.OpenApi` | Dependencies | Medium | Low |
| [R6](#r6--validate-post-apiproducts-and-put-apiuser-on-the-server) | Validate `POST /api/products` and `PUT /api/user` on the server | Input validation | Medium | Low |
| [R7](#r7--run-containers-as-non-root-and-pin-base-images) | Run containers as non-root and pin base images | Containers | Medium | Low |
| [R8](#r8--add-http-security-headers-to-nginx) | Add HTTP security headers to nginx | Web security | Medium | Low |
| [R9](#r9--harden-the-ci-supply-chain-oidc-only-actions-pinned-by-sha) | Harden the CI supply chain: OIDC only, actions pinned by SHA | CI/CD | Medium | Low |
| [R10](#r10--add-health-endpoints-probes-and-a-global-exception-handler) | Add health endpoints, probes and a global exception handler | Operability | Medium | Low |
| [R11](#r11--replace-acr-admin-credentials-with-managed-identity-acrpull) | Replace ACR admin credentials with managed identity (`AcrPull`) | Infrastructure | Medium | Medium |
| [R12](#r12--partition-the-recipe-assistant-quota-per-client) | Partition the recipe-assistant quota per client | Availability / cost | Medium | Medium |
| [R13](#r13--move-to-a-standard-test-framework-and-add-front-end-unit-tests) | Move to a standard test framework and add front-end unit tests | Testing | Medium | Medium |
| [R14](#r14--reduce-the-scope-of-the-global-datastoregate) | Reduce the scope of the global `DataStore.Gate` | Concurrency / availability | Medium | High |
| [R15](#r15--fix-the-latent-cloneitem-bug-in-recipe-commit) | Fix the latent `CloneItem` bug in recipe commit | Correctness | Low | Low |
| [R16](#r16--bound-search-inputs) | Bound search inputs (query length, terms, page) | Robustness | Low | Low |
| [R17](#r17--use-utc-timestamps-and-timeprovider) | Use UTC timestamps and `TimeProvider` | Correctness | Low | Low |
| [R18](#r18--fix-the-cors-configuration-mismatch) | Fix the CORS configuration mismatch | Configuration | Low | Low |
| [R19](#r19--use-managedidentitycredential-in-production) | Use `ManagedIdentityCredential` in production | Security / performance | Low | Low |
| [R20](#r20--resolve-the-react-lint-warnings) | Resolve the React lint warnings | Front end | Low | Low |
| [R21](#r21--shrink-the-analytics-bundle) | Shrink the analytics bundle (tree-shaken ECharts) | Performance | Low | Low |
| [R22](#r22--front-end-api-client-timeouts-and-payment-data-minimisation) | Front-end API client: timeouts and payment-data minimisation | Front end | Low | Low |
| [R23](#r23--clean-up-dead-code-and-duplicated-middleware) | Clean up dead code and duplicated middleware | Maintainability | Low | Low |
| [R24](#r24--update-build-time-npm-dependencies-and-local-scripts) | Update build-time npm dependencies and local scripts | Dependencies | Low | Low |
| [R25](#r25--refresh-the-readme-quality-section) | Refresh the README quality section | Documentation | Low | Low |
| [R26](#r26--split-programcs-into-endpoint-groups-and-centralise-cart-rules) | Split `Program.cs` into endpoint groups and centralise cart rules | Maintainability | Low | Medium |
| [R27](#r27--encapsulate-datastore-and-make-seeding-reproducible) | Encapsulate `DataStore` and make seeding reproducible | Maintainability | Low | Medium |
| [R28](#r28--localise-api-error-messages) | Localise API error messages | i18n | Low | Medium |
| [R29](#r29--split-the-largest-react-components) | Split the largest React components | Maintainability | Low | Medium |
| [R30](#r30--migrate-telemetry-to-opentelemetry) | Migrate telemetry to OpenTelemetry | Observability | Low | Medium |

---

## High risk

### R1 — Add a quality gate to CI before deploying to production

**Risk: High · Complexity: Low**

**Finding.** `deploy.yml` runs on every push to `main` and deploys to the production environment (`AZURE_ENV_NAME: zava-prod`). Before provisioning, it only runs the Bicep build, `deploy-recipe-agents.py --check`, the Python deployment tests and the Docker builds ([deploy.yml#L42-L51](../.github/workflows/deploy.yml#L42-L51)). It never runs `tests/Zava.Api.RecipeChecks`, `npm run lint` or the `tests/recipe-ui` suite, and no workflow runs on pull requests. A regression in cart, recipe or MCP behaviour can reach production without any test.

**Recommendation.**
- Add a `ci.yml` workflow on `pull_request` and `push` with these steps: `dotnet build -warnaserror` (or at least fail on `NU1903`), `dotnet run --project tests/Zava.Api.RecipeChecks`, `npm ci && npm run lint && npm run build` in `src/Zava.Web`, and `npm audit --audit-level=high --omit=dev`.
- In `deploy.yml`, make the deploy job depend on these checks (`needs:` or a reusable workflow), and protect `main` with required status checks.
- Optionally add a GitHub `environment: production` with required reviewers.

### R2 — Protect administrative and mutating endpoints on the public deployment

**Risk: High · Complexity: Medium**

**Finding.** The API Container App has public ingress (`external: true`, [container-app.bicep#L35-L40](../infra/modules/container-app.bicep#L35-L40)), and no endpoint requires authentication. Anyone on the Internet can:
- reset all demo data or switch the store for every visitor: `POST /api/config/reset` and `PUT /api/config/site-type` ([Program.cs#L99-L109](../src/Zava.Api/Program.cs#L99-L109));
- inject catalogue products: `POST /api/products` ([Program.cs#L167-L195](../src/Zava.Api/Program.cs#L167-L195));
- read and overwrite the shared profile (name, e-mail, phone, addresses): `GET/PUT /api/user` ([Program.cs#L433-L454](../src/Zava.Api/Program.cs#L433-L454));
- drive the shared basket and read every order through `/mcp` ([Program.cs#L93](../src/Zava.Api/Program.cs#L93)).

The README states that the demo has no authentication. Even so, one anonymous request can wreck a live demo.

**Recommendation.**
1. Quick mitigation (Low): disable the admin endpoints (`/api/config/reset`, `/api/config/site-type`, `POST /api/products`) when `!app.Environment.IsDevelopment()`, or protect them with an API key or a policy from Container Apps authentication (Easy Auth with Entra ID).
2. Make the API ingress **internal** (`external: false`) so that it is reachable only through the web app's nginx proxy. If `/mcp` must stay public, expose it through a separate, authenticated route.
3. For `/mcp`, follow the MCP Streamable HTTP security guidance: require authentication (OAuth / Entra ID bearer token) and validate the `Origin` header to prevent DNS rebinding.

### R3 — Make checkout transactional: decrement stock, validate input, add idempotency

**Risk: High (real use) / Medium (demo) · Complexity: Medium**

**Finding.** `POST /api/checkout` ([Program.cs#L343-L419](../src/Zava.Api/Program.cs#L343-L419)) has these gaps:
- it never decrements `Product.Stock` or `Variant.Stock`, so stock checks in `CartOperations.HasAvailableStock` stay valid after any number of orders (overselling);
- it does not validate `ShippingAddress` or the payment fields on the server;
- it has no idempotency key, so a client retry after a timeout creates a duplicate order;
- it assigns every order to `store.Users.FirstOrDefault()`;
- it fails 10 % of payments at random (`Random.Shared.NextDouble() < 0.10`). This is a deliberate demo feature, but it makes automated end-to-end tests non-deterministic.

The README already lists this as a high-priority item.

**Recommendation.** Under the gate (or a database transaction later), re-check stock for each line and then decrement it. Validate the address and payment fields (required, maximum lengths, card format via Luhn, expiry date in the future). Accept an `Idempotency-Key` header and return the existing order on a retry. Make the random failure configurable, for example `Checkout:SimulatedFailureRate`, and set it to 0 in tests.

### R4 — Introduce user identity, per-user state and persistence

**Risk: High (real use) · Complexity: High**

**Finding.** All state (cart, orders, profile, recipe plans, quotas) lives in one in-memory `DataStore` singleton that every visitor shares ([DataStore.cs#L5-L17](../src/Zava.Api/Services/DataStore.cs#L5-L17)). Because of this, the API is pinned to `minReplicas: 1` / `maxReplicas: 1` ([main.bicep#L150-L152](../infra/main.bicep#L150-L152)), and every restart or redeployment loses data.

**Recommendation.** This is the main architectural step from demo to product:
- authenticate users with Entra ID / Entra External ID;
- key the cart and orders by user (or by an anonymous session cookie before sign-in);
- persist state in Azure SQL, Cosmos DB or PostgreSQL, using optimistic concurrency instead of the global semaphore;
- move recipe plans and quotas to a distributed cache such as Azure Cache for Redis.

After that, `maxReplicas` can be raised.

---

## Medium risk

### R5 — Upgrade `Microsoft.AspNetCore.OpenApi` to fix the vulnerable `Microsoft.OpenApi`

**Risk: Medium · Complexity: Low**

**Finding.** `Microsoft.AspNetCore.OpenApi` 10.0.2 ([Zava.Api.csproj#L13](../src/Zava.Api/Zava.Api.csproj#L13)) pulls in `Microsoft.OpenApi` 2.0.0, which is affected by [GHSA-v5pm-xwqc-g5wc](https://github.com/advisories/GHSA-v5pm-xwqc-g5wc): a crafted OpenAPI document with circular references can terminate the process through a stack overflow. Zava only *generates* OpenAPI documents (in Development) and does not parse untrusted ones, so the risk is low in practice. However, the build shows a high-severity warning (NU1903), and dependency scanners will flag the image.

**Recommendation.** Bump `Microsoft.AspNetCore.OpenApi` to **10.0.12**, which depends on `Microsoft.OpenApi` ≥ 2.12.0 (patched from 2.7.5). Then add `<WarningsAsErrors>NU1901;NU1902;NU1903;NU1904</WarningsAsErrors>` (or `<NuGetAuditLevel>`) to keep this from coming back. Run `dotnet run --project tests/Zava.Api.RecipeChecks` afterwards.

### R6 — Validate `POST /api/products` and `PUT /api/user` on the server

**Risk: Medium · Complexity: Low**

**Finding.**
- `POST /api/products` ([Program.cs#L167-L195](../src/Zava.Api/Program.cs#L167-L195)) accepts any `Price`, `Stock` and `CategoryId`, including negative values and unknown categories, and has no limits on `Name`, `Description` or `Brand`. Because of this, products with a negative price can reduce a cart total. An unknown category creates orphan products. Very large strings stay in memory until the next reset; the only bound is Kestrel's default 30 MB request size.
- `PUT /api/user` ([Program.cs#L439-L454](../src/Zava.Api/Program.cs#L439-L454)) binds the whole `User` entity (over-posting) without validating the e-mail, the phone, string lengths or the address fields.

**Recommendation.** Use dedicated request DTOs with .NET 10 minimal-API validation (`builder.Services.AddValidation()` plus DataAnnotations such as `[Range]`, `[StringLength]`, `[EmailAddress]`), or explicit guard clauses like those in `RecipeBasketService.ValidRequest`. Reject an unknown `CategoryId` with 400. Lower `MaxRequestBodySize` for all `/api` routes, for example to 64 KB.

### R7 — Run containers as non-root and pin base images

**Risk: Medium · Complexity: Low**

**Finding.**
- The API runtime stage ([src/Zava.Api/Dockerfile#L13-L22](../src/Zava.Api/Dockerfile#L13-L22)) never sets `USER`, so the process runs as root. The .NET 8+ images ship a non-root `app` user, and the app already listens on port 8080.
- The web image uses `nginx:alpine`, whose master process runs as root, and the floating tags `nginx:alpine` and `node:22-alpine` ([src/Zava.Web/Dockerfile#L2](../src/Zava.Web/Dockerfile#L2), [#L16](../src/Zava.Web/Dockerfile#L16)). Builds are therefore not reproducible.

**Recommendation.** Add `USER $APP_UID` to the API runtime stage. Use `nginxinc/nginx-unprivileged:<version>-alpine` (port 8080) and update `targetPort` in `main.bicep`. Pin base images to a version, ideally by digest, and let Dependabot update them.

### R8 — Add HTTP security headers to nginx

**Risk: Medium · Complexity: Low**

**Finding.** [nginx.conf](../src/Zava.Web/nginx.conf) sets no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`/`X-Frame-Options` or `Permissions-Policy` header, and leaves `server_tokens` on. The `resolver 168.63.129.16 8.8.8.8` directive ([nginx.conf#L7](../src/Zava.Web/nginx.conf#L7)) falls back to a public DNS server. It is also ineffective, because `proxy_pass` uses a literal URL that is resolved only at start-up.

**Recommendation.** Add `server_tokens off;` and `add_header … always;` for the headers above. A strict CSP such as `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'` works for MUI/Emotion. Enable `gzip` for JS/CSS. Either remove the public resolver or use a variable in `proxy_pass` so the Azure resolver is actually used.

### R9 — Harden the CI supply chain: OIDC only, actions pinned by SHA

**Risk: Medium · Complexity: Low**

**Finding.** `deploy.yml` still supports a long-lived client secret in `AZURE_CREDENTIALS` and treats it as the preferred mode ([deploy.yml#L53-L73](../.github/workflows/deploy.yml#L53-L73)). Third-party actions are referenced by mutable tags (`actions/checkout@v5`, `Azure/setup-azd@v2`).

**Recommendation.** Keep only the federated (OIDC) login, which the workflow already supports, and delete the `AZURE_CREDENTIALS` secret. Pin actions to full commit SHAs, with a version comment, and let Dependabot (`github-actions` ecosystem) update them.

### R10 — Add health endpoints, probes and a global exception handler

**Risk: Medium · Complexity: Low**

**Finding.** The API has no `/health` endpoint, and the Container Apps template defines no liveness or readiness probes ([container-app.bicep#L60-L91](../infra/modules/container-app.bicep#L60-L91)). There is no `UseExceptionHandler` / `AddProblemDetails`, so an unexpected exception (for example `int.Parse` on an unexpected image file name at [Program.cs#L158-L160](../src/Zava.Api/Program.cs#L158-L160)) returns an empty 500 instead of a consistent JSON error. The post-deployment smoke check uses `/api/config`, which waits for the global gate.

**Recommendation.** Add `builder.Services.AddHealthChecks()` with `app.MapHealthChecks("/health/live")` and `/health/ready` outside the `/api` gate. Wire them to Container Apps probes. Add `AddProblemDetails()` + `UseExceptionHandler()` so that errors keep the `{ message }` / ProblemDetails contract.

### R11 — Replace ACR admin credentials with managed identity (`AcrPull`)

**Risk: Medium · Complexity: Medium**

**Finding.** The registry enables the admin user ([container-registry.bicep#L13](../infra/modules/container-registry.bicep#L13)). Container Apps pull with `listCredentials()` username and password, which are stored as a Container App secret ([container-app.bicep#L41-L52](../infra/modules/container-app.bicep#L41-L52)). Admin credentials are shared, have full push and pull rights, and are not tied to an identity.

**Recommendation.** Create a user-assigned managed identity and grant it `AcrPull` on the registry before the apps are created, which avoids the system-identity chicken-and-egg problem. Reference it in `registries: [{ server, identity }]`, then set `adminUserEnabled: false`.

### R12 — Partition the recipe-assistant quota per client

**Risk: Medium · Complexity: Medium**

**Finding.** `RecipeBasketService.ReserveBudget` enforces one **process-wide** budget: 6 requests per minute, 40 per hour and 100 per day ([RecipeBasketService.cs#L205-L216](../src/Zava.Api/Services/RecipeBasketService.cs#L205-L216)). The budget protects Azure costs, but one anonymous client can use up the daily quota and disable the feature for every visitor. Other endpoints have no rate limiting.

**Recommendation.** Add ASP.NET Core rate limiting (`AddRateLimiter` with `PartitionedRateLimiter` keyed on client IP from `X-Forwarded-For`, or on user ID once R4 is done). Keep the global budget as a cost ceiling and add a general, generous limit on `/api` and `/mcp`.

### R13 — Move to a standard test framework and add front-end unit tests

**Risk: Medium · Complexity: Medium**

**Finding.**
- `tests/Zava.Api.RecipeChecks` is a console program. It starts the API by invoking the assembly entry point and swaps services through a `DiagnosticListener` hook on `HostBuilding` ([tests/Zava.Api.RecipeChecks/Program.cs#L16-L37](../tests/Zava.Api.RecipeChecks/Program.cs#L16-L37)). The first failed `Assert` stops the run, so reports are all-or-nothing. Test runners and CI test reports cannot discover these checks.
- The front end has no unit or component tests (no Vitest/Jest, no `test` script in `package.json`). `tests/recipe-ui` needs a manual set-up with four processes and Chrome.

**Recommendation.** Move the API checks to xUnit (or MSTest/NUnit) with `WebApplicationFactory<Program>`; add `public partial class Program;` and override services in `ConfigureTestServices`. Keep the current scenarios as individual tests. Add Vitest + React Testing Library for `api.ts`, hooks and cart and checkout components. Script the `recipe-ui` suite (for example with Playwright) so CI can run it.

### R14 — Reduce the scope of the global `DataStore.Gate`

**Risk: Medium · Complexity: High**

**Finding.** The middleware takes a single `SemaphoreSlim(1,1)` for every `/api` request and holds it until the response is fully written ([Program.cs#L60-L76](../src/Zava.Api/Program.cs#L60-L76)). `/mcp` does the same for each tool call. This makes the shared lists safe, but it serialises all traffic: one slow client reading a large response, such as `/api/products` with every product, blocks every other request, up to Kestrel's minimum response data rate. It also caps throughput at one request at a time.

**Recommendation.** Short term: serialise responses into a buffer while holding the gate, then release the gate before writing to the network. Also let read-only endpoints use immutable snapshots, as recipe planning already does. Longer term (with R4), use per-user state and optimistic concurrency in a database instead of a process-wide lock.

---

## Low risk

### R15 — Fix the latent `CloneItem` bug in recipe commit

**Risk: Low · Complexity: Low**

**Finding.** `RecipeBasketService.Commit` copies the existing cart with `CloneItem` ([RecipeBasketService.cs#L126](../src/Zava.Api/Services/RecipeBasketService.cs#L126), [#L320-L324](../src/Zava.Api/Services/RecipeBasketService.cs#L320-L324)) and replaces `store.Cart.Items` with the copy. `CloneItem` drops `RegularUnitPrice`, `OfferTriggerProductId` and `DiscountPercent`. A discounted cross-sell line would therefore become a regular line that keeps the discounted price. Today this cannot happen, because cross-sell is limited to Electronics/Appliances and recipe baskets to Grocery, and changing the store resets the cart. The bug would surface as soon as either rule changes.

**Recommendation.** Copy every `CartItem` property, or give `CartItem` a single `Clone()` method that both checkout and recipe commit use. Add a regression check.

### R16 — Bound search inputs

**Risk: Low · Complexity: Low**

**Finding.** `SearchService.Search` splits an unbounded `Query` into terms and runs every term against every product field ([SearchService.cs#L21](../src/Zava.Api/Services/SearchService.cs#L21)). A very long query costs CPU while the global gate is held (see R14). `page` is not bounded: `(page - 1) * pageSize` overflows for very large values, and the response then shows the first page labelled with the requested page number ([SearchService.cs#L91](../src/Zava.Api/Services/SearchService.cs#L91)). The MCP tool passes `page` through unchanged ([ZavaMcpTools.cs#L64](../src/Zava.Api/Services/ZavaMcpTools.cs#L64)).

**Recommendation.** Reject or truncate queries longer than about 200 characters or with more than about 10 terms. Clamp `page` to `[1, totalPages]`, or compute the offset as `long`.

### R17 — Use UTC timestamps and `TimeProvider`

**Risk: Low · Complexity: Low**

**Finding.** Orders, tracking numbers, reviews and analytics use `DateTime.Now` (for example [Program.cs#L186](../src/Zava.Api/Program.cs#L186), [#L404-L405](../src/Zava.Api/Program.cs#L404-L405), `AnalyticsService` and `DataSeeder`), while recipe plans use `DateTimeOffset.UtcNow`. The results depend on the server's time zone, which is UTC in the container and local on a developer machine, and are hard to test.

**Recommendation.** Use `DateTimeOffset.UtcNow`, or better, inject `TimeProvider` so tests can control time. Format dates in the user's time zone in the front end.

### R18 — Fix the CORS configuration mismatch

**Risk: Low · Complexity: Low**

**Finding.** `appsettings.json` defines `Cors:Origins` ([appsettings.json#L15-L17](../src/Zava.Api/appsettings.json#L15-L17)), but the code reads `AllowedOrigins` ([Program.cs#L32-L33](../src/Zava.Api/Program.cs#L32-L33)). The setting is dead, and production falls back to hard-coded `localhost` origins. It works today only because nginx proxies `/api` on the same origin.

**Recommendation.** Read one key, for example `Cors:Origins`, and remove the other. Set the deployed web origin explicitly through Bicep, or drop CORS in production if the API becomes internal (R2).

### R19 — Use `ManagedIdentityCredential` in production

**Risk: Low · Complexity: Low**

**Finding.** `DefaultAzureCredential` is registered for every environment ([Program.cs#L19](../src/Zava.Api/Program.cs#L19)). In production it walks a chain of credential types: this adds latency and failure modes, and it can pick up an unintended identity. Azure SDK guidance recommends a deterministic credential in production.

**Recommendation.** Use `ManagedIdentityCredential` when not in Development, and keep `DefaultAzureCredential` (or `AzureCliCredential`) for local development.

### R20 — Resolve the React lint warnings

**Risk: Low · Complexity: Low**

**Finding.** `npm run lint` reports 7 `react-hooks/set-state-in-effect` warnings: `CartPage.tsx:40`, `CheckoutPage.tsx:86`, `OrderDetailPage.tsx:46`, `ProductPage.tsx:77`, `ProfilePage.tsx:88,106` and `RecipeBasketPage.tsx:149`. These synchronous `setState` calls at the start of effects cause extra renders.

**Recommendation.** Derive the loading or reset state from the request key (for example `key`-based remounts, or keep the "loading for id X" value in state), or use a data-fetching helper such as React Router loaders or TanStack Query. Then turn the rule into an error in `eslint.config.js` so new warnings fail CI (R1).

### R21 — Shrink the analytics bundle

**Risk: Low · Complexity: Low**

**Finding.** Routes are already lazy-loaded ([App.tsx#L13-L34](../src/Zava.Web/src/App.tsx#L13-L34)). However, `AnalyticsPage` imports `echarts-for-react` by default ([AnalyticsPage.tsx#L6](../src/Zava.Web/src/pages/AnalyticsPage.tsx#L6)), which pulls in all of ECharts: the chunk is 1.14 MB (380 KB gzip).

**Recommendation.** Import `echarts-for-react/lib/core` and register only the charts and components you use (`echarts/core`, `BarChart`, `PieChart`, `LineChart`, `GridComponent`, `TooltipComponent`, `CanvasRenderer`).

### R22 — Front-end API client: timeouts and payment-data minimisation

**Risk: Low · Complexity: Low**

**Finding.**
- `request()` in [api.ts#L21-L45](../src/Zava.Web/src/api.ts#L21-L45) has no timeout. If the API hangs, spinners never end unless the caller passes its own `AbortSignal`.
- Checkout sends the full card number to the API ([CheckoutPage.tsx#L157](../src/Zava.Web/src/pages/CheckoutPage.tsx#L157)), but the server only checks whether it ends with `0000`. The README warns users not to enter real card data. Still, sending a full PAN to a server that is not PCI-scoped is a bad pattern to demonstrate.

**Recommendation.** Combine the caller's signal with `AbortSignal.timeout(…)` (for example 15 s by default, longer for recipe planning). Send only a test token or the last four digits, or document the field as "test card only" in the UI.

### R23 — Clean up dead code and duplicated middleware

**Risk: Low · Complexity: Low**

**Finding.**
- `SalesByCategory` and `RecentOrder` DTOs ([ApiDtos.cs#L150](../src/Zava.Api/Models/ApiDtos.cs#L150), [#L157](../src/Zava.Api/Models/ApiDtos.cs#L157)) are unused.
- `Services/Seeders/JsonExporter.cs` is an empty placeholder whose comment says it "can be safely deleted".
- `UseStaticFiles()` is registered twice ([Program.cs#L58](../src/Zava.Api/Program.cs#L58) and [#L475](../src/Zava.Api/Program.cs#L475)). The SPA fallback `MapFallbackToFile("index.html")` is unnecessary in the API container, because nginx serves the SPA.
- `RecipeBasketEndpoints` catches a long list of exception types ([RecipeBasketEndpoints.cs#L47-L52](../src/Zava.Api/Services/RecipeBasketEndpoints.cs#L47-L52)). It logs only the generic outcome `unavailable`, never the exception type, so provider failures are hard to diagnose.

**Recommendation.** Delete the unused types and the file, keep a single `UseStaticFiles`, and log the swallowed exception at `Warning` level without the prompt content.

### R24 — Update build-time npm dependencies and local scripts

**Risk: Low · Complexity: Low**

**Finding.** `npm audit` reports advisories in build-time-only packages: `browserslist` (high), `@humanfs/node` and `baseline-browser-mapping` (moderate) and `@babel/core` (low). None of them ship in the production bundle. `start.sh` runs `npm install`, which can rewrite the lockfile, instead of `npm ci`.

**Recommendation.** Run `npm audit fix` through the protected feed (keep the lockfile URLs on `packagefeedproxy.microsoft.io`, which `tests/deployment` requires). Enable Dependabot for `npm` and `nuget`. Use `npm ci` in `start.sh` and `start.ps1`.

### R25 — Refresh the README quality section

**Risk: Low · Complexity: Low**

**Finding.** Parts of [README › Évaluation qualité et priorités](../README.md#évaluation-qualité-et-priorités) are out of date. It says that the build loads "≈ 1.82 MB of JavaScript in a single bundle" (routes are now lazy-loaded; the initial chunk is 388 KB) and that lint reports "nine errors" (there are now 0 errors and 7 warnings).

**Recommendation.** Update those statements and link this report as the current priority list.

### R26 — Split `Program.cs` into endpoint groups and centralise cart rules

**Risk: Low · Complexity: Medium**

**Finding.** `Program.cs` (536 lines) holds the start-up code and almost every endpoint. It also holds the cross-sell and warranty rules (`/api/cart/cross-sell`, `/api/cart/warranty`, `BuildCrossSellOffer`, `GetWarrantyOffer`), while the other cart rules live in `CartOperations` and are shared with MCP. Warranty lines are encoded as **negative product IDs** (`ProductId = -req.ProductId`, [Program.cs#L286](../src/Zava.Api/Program.cs#L286)). This implicit convention leaks into `CartOperations`, MCP and the front end.

**Recommendation.** Follow the existing `RecipeBasketEndpoints` pattern: move each area into an extension with `MapGroup("/api/…")` (config, catalogue, cart, checkout, orders, user, analytics). Move cross-sell and warranty rules into `CartOperations` so MCP can reuse them. Replace negative IDs with an explicit `CartLineKind` (`Product`, `Warranty`, `Offer`) or a `WarrantyForProductId` field.

### R27 — Encapsulate `DataStore` and make seeding reproducible

**Risk: Low · Complexity: Medium**

**Finding.** `DataStore` exposes mutable `List<T>` properties that any caller can change ([DataStore.cs#L11-L17](../src/Zava.Api/Services/DataStore.cs#L11-L17)). Correctness depends on every caller holding `Gate`, which is only a convention in comments. The private `_lock` in `Initialize` duplicates `Gate` without protecting readers. `DataSeeder` uses one static `Random(42)` ([DataSeeder.cs#L8](../src/Zava.Api/Services/DataSeeder.cs#L8)), so each reset produces *different* reviews, orders and second-life products, even though the seed is fixed.

**Recommendation.** Expose read-only views (`IReadOnlyList<T>`) and mutation methods that require the gate. Remove the redundant `_lock`. Create a new `Random(seed)` per `Initialize` call so each reset is reproducible.

### R28 — Localise API error messages

**Risk: Low · Complexity: Medium**

**Finding.** The front end is bilingual (FR/EN), but every API error message is hard-coded in French: cart, checkout, recipe basket and MCP refusals. English users see French errors.

**Recommendation.** Return stable error codes (for example `{ code: "cart.insufficient_stock", message }` or ProblemDetails `type`), translate them in the front end with the existing i18n dictionaries, and keep `message` as a fallback. Alternatively, use `IStringLocalizer` with `Accept-Language`.

### R29 — Split the largest React components

**Risk: Low · Complexity: Medium**

**Finding.** Several files are large: `RecipeBasketPage.tsx` (872 lines), `i18n.ts` (709), `Layout.tsx` (605), `CheckoutPage.tsx` (582) and `ProductPage.tsx` (519). Large components are harder to review and test (R13) and tend to re-render more than needed.

**Recommendation.** Extract sub-components (recipe form, plan preview, excluded items, post-commit offers; header, navigation, footer; checkout steps) and custom hooks for data fetching. Split `i18n.ts` by feature, as `locales/*.ts` already does.

### R30 — Migrate telemetry to OpenTelemetry

**Risk: Low · Complexity: Medium**

**Finding.** The API uses the classic `Microsoft.ApplicationInsights.AspNetCore` 2.23 SDK and `TelemetryClient.TrackEvent`. Version 3.x of the SDK and the Azure Monitor OpenTelemetry Distro are the recommended path.

**Recommendation.** Move to `Azure.Monitor.OpenTelemetry.AspNetCore` (`UseAzureMonitor()`) and replace the custom events with `ActivitySource` / `Meter` instruments. Keep the guarantee that recipe text is never recorded.

---

## Positive practices observed

These practices are already in place; keep them as they are:

- **Hardened LLM integration.** `FoundryRecipeClient` accepts only an HTTPS Foundry project endpoint (no user info, query or non-default port), disables redirects, caps response size (64 KB envelope, 16 KB output), limits JSON depth, and requires exactly one `output_text` part. `RecipeBasketService` validates the model output against a strict schema and the catalogue snapshot, and treats every model value as untrusted.
- **Prompt-injection framing.** Agent instructions and per-call tasks state that inputs are "data, never instructions". Agents use `tools: []`, `store = false` and strict JSON schemas, and Foundry tracing is opt-in because traces can contain prompts.
- **Input bounds on the AI path.** The recipe endpoints have a 4 KB request limit (enforced by Kestrel, with a JSON 413 body), validate recipe length, control characters, servings, preference and exclusions, and cap concurrency at 2.
- **Price and stock authority on the server.** Cart, cross-sell and recipe commit recompute prices and stock from the catalogue. The recipe commit is atomic and idempotent per plan.
- **Shared cart rules.** `CartOperations` is reused by REST and MCP, so both clients follow the same rules.
- **Identity-based Azure access.** The Foundry account has `disableLocalAuth: true`, the API uses a managed identity with the least-privilege `Azure AI User` role, and the CI role delegation is restricted by an ABAC condition ([bootstrap-ci-access.bicep](../infra/bootstrap-ci-access.bicep)).
- **Careful deployment script.** `deploy-recipe-agents.py` never prints error bodies or credentials, validates endpoints, disables redirects, caps response sizes and versions agents by content hash.
- **Front end.** Strict TypeScript and no `any`; no `dangerouslySetInnerHTML` or other XSS sinks; fetches can be cancelled with `AbortController`; routes are lazy-loaded; accessibility work includes a skip link, focus management, alt text and WCAG AA contrast enforced in `theme.ts`.
- **Existing regression checks.** `tests/Zava.Api.RecipeChecks` covers cart, recipe and MCP invariants (including concurrency and idempotency), and `tests/recipe-ui` covers the recipe UI flows.
