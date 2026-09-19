# P40B-3A — Shared Shell Contract & Pilot Consolidation Report

**Status:** COMPLETE — PILOT ONLY

## 1. Canonical baseline

The baseline is the finalized P40B-2 canonical repository. No earlier package or deployment artifact was used as the implementation source.

P39, P40A, P40B-1, and P40B-2 remain locked.

## 2. Objective

P40B-3A tests whether the current `assets/portal-shell.js` can operate from minimal `.top` / `.shell` / `.side` / `.main` hosts after duplicated static header/sidebar content is removed, while leaving business content and the shared runtime untouched.

## 3. Pilot selection

Maximum three pilot pages were selected:

| Pilot | Case | Reason | Risk before change |
|---|---|---|---|
| `airport-systems.html` | A — compact/simple | Small page-owned redirect content with the normal duplicated shell; low business coupling | LOW |
| `kontak.html` | B — normal business/support page | Representative page-owned form/content while using the standard duplicated shell | LOW–MEDIUM |
| `calendar.html` | C — complex reference | Important P40A shell case with substantial page-owned calendar/modal content; selected only after confirming standard shell structure and preserving its content | MEDIUM |

Excluded from the pilot: login/authentication, administration/security, P29 commercial pages, and P39 Asset & Facility.

### Control page

`customer-experience.html` was used as the byte-identity control. Its baseline SHA-256 was taken directly from the P40B-2 package and compared after the pilot.

Result: **CONTROL UNCHANGED**.

## 4. Derived shell DOM contract

Current `portal-shell.js` evidence establishes these required direct hosts:

```text
body > .top
body > .shell
body > .shell > .side
body > .shell > .main
```

`ensureShell()` returns no shell reference when these hosts are absent. `shell()` then populates `.top` and `.side`, while `.main` remains the page-owned content host.

The pilot therefore removed only duplicated inner header/sidebar markup, not the required host elements.

Detailed contract: [SHARED_SHELL_CONTRACT.md](SHARED_SHELL_CONTRACT.md).

## 5. Pilot modifications

### `airport-systems.html`

- Retained `<header class="top"></header>`.
- Retained `.shell > .side` as an empty host.
- Preserved the page-owned `.main` redirect content.
- Preserved all scripts and their order.
- Preserved `portal.css` and `portal-shell.js` references.
- Footer and back-to-top control were retained.

Size: **5,106 → 1,878 bytes**, a reduction of **3,228 bytes / 63.25%**.

### `kontak.html`

- Retained empty `.top` and `.side` hosts.
- Preserved the contact form and all page-owned content.
- Preserved inline page handlers.
- Preserved all scripts and their order.
- Footer retained.

Size: **6,243 → 3,015 bytes**, a reduction of **3,228 bytes / 51.71%**.

### `calendar.html`

- Retained empty `.top` and `.side` hosts.
- Preserved the calendar workspace, controls, page-specific handlers, and modal/page content.
- Preserved all scripts and their order.
- Footer/back-to-top/page-specific content retained.

Size: **8,830 → 5,607 bytes**, a reduction of **3,223 bytes / 36.50%**.

## 6. Content preservation

No page-specific business content was intentionally removed. No business engine file was modified.

No page route, filename, title, head metadata, stylesheet reference, page-specific script reference, or page-owned main content contract was changed.

## 7. Script-order result

All three pilots retain the exact P40B-2 script source sequence.

**SCRIPT LOAD ORDER CHANGES = 0**.

## 8. portal.css

`assets/portal.css` SHA-256 is identical before and after.

**portal.css modified = 0**.

## 9. portal-shell.js

`assets/portal-shell.js` SHA-256 is identical before and after.

**portal-shell.js modified = 0**.

## 10. Page-engine status

No external page-specific business engine file was modified. The pilots' page-specific inline logic was retained. Shared runtime files, including the existing presentation and domain modules, were not changed.

## 11. Template status

All P40B-2 template files remain unchanged.

**Templates modified = 0**

**Templates deleted = 0**

## 12. Authentication/security status

Authentication, Firebase client/configuration, permission logic, Dashboard POV, Firestore rules, and protected authentication/server files remain unchanged.

The protected hash report is in [P40B-3A_PROTECTED_HASHES.txt](P40B-3A_PROTECTED_HASHES.txt).

## 13. Dedicated contract test

`tests/p40b3a-shared-shell-contract.js` verifies:

- required pilot shell hosts;
- exactly one `portal-shell.js` reference;
- `portal.css` reference;
- page-owned `.main` boundary;
- empty `.top`/`.side` pilot hosts;
- byte-identical control page;
- unchanged pilot script order.

Result:

**P40B3A_SHARED_SHELL_CONTRACT_PASS**

## 14. Existing regression suite

`npm run build` passed all existing gates:

- `PACKAGE_VERIFY_PASS`
- `REGRESSION_AUDIT_PASS`
- `P29_LOUNGE_PLANNING_PASS`
- `P31_AUTHENTICATION_CONTRACT_PASS`
- `P31_ROLE_POV_RUNTIME_PASS`
- `P31A_SESSION_PROFILE_SERVICE_PASS`
- `P31B_LOGIN_ACCESS_ASSISTANCE_PASS`
- `P32_ACCESS_ASSISTANCE_ADMIN_PASS`
- `P32_ACCESS_ASSISTANCE_RUNTIME_PASS`
- `P33_P34_P35_P36_P37_PRESENTATION_CONTRACT_PASS`
- `P27_PROFILE_SELF_SERVICE_CONTRACT_PASS`
- `P38_REPOSITORY_HYGIENE_PASS`

P40B-2's template contract gate remains part of the locked baseline; no template source was changed in this phase.

## 15. Local HTTP verification

The existing local HTTP server was used. All three pilot pages returned HTTP 200:

- `/airport-systems.html` → 200
- `/kontak.html` → 200
- `/calendar.html` → 200

No authentication bypass was used.

## 16. Browser / visual validation

**VISUAL VALIDATION = PENDING.**

No browser-capable rendering environment was available in this execution context. Therefore no visual PASS is claimed, and no claim is made about authenticated production rendering.

## 17. Direct-file mode

The pilot remains dependent on the normal JavaScript runtime and existing authentication/application infrastructure. No `file://` workaround or authentication bypass was introduced. Direct-file behavior was not promoted to the canonical runtime model.

## 18. Rollback result

No pilot required rollback based on the available static/HTTP/regression evidence.

However, browser-level hydration and visual validation remain pending. This limits the result to **PASS WITH LIMITATION** rather than an unconditional browser-equivalence claim.

## 19. Per-pilot eligibility

| Pilot | Result |
|---|---|
| `airport-systems.html` | PASS WITH LIMITATION — static/HTTP/regression evidence passes; browser visual validation pending |
| `kontak.html` | PASS WITH LIMITATION — static/HTTP/regression evidence passes; browser visual validation pending |
| `calendar.html` | PASS WITH LIMITATION — static/HTTP/regression evidence passes; browser visual validation pending |

## 20. P40B-3B preliminary eligibility matrix

This matrix is an investigation guide only. It does **not** authorize P40B-3B execution.

### GROUP A — likely eligible for the same contract

Pages with the ordinary `.top` / `.shell` / `.side` / `.main` structure and no special authentication/P29/P39/core exception identified by the P40A/P40B review:

`airport-experience-map.html`, `berita.html`, `bo-space.html`, `branch-office-planning.html`, `budget-cost.html`, `gaso-planning.html`, `improvement-intake.html`, `index.html`, `layanan.html`, `management-outcome.html`, `map.html`, `network-stations.html`, `planning-documents.html`, `planning-workspace.html`, `post-flight.html`, `post-journey.html`, `pre-flight.html`, `pre-journey.html`, `program-kerja.html`, `readiness.html`, `service-capability.html`, `service-locations.html`, `service-planning.html`, `standar.html`, `station-360.html`, `touchpoint.html`.

These remain unmodified and require separate rollout authorization.

### GROUP B — page-specific investigation required

`customer-experience.html`, `cx-import.html`, `initiative-conversion.html`, `initiative-traceability.html`, `inisiatif.html`, `station-material.html`, `service.html`, `action-scenario.html`.

These have either an already-minimal shell, unusual/redirect behavior, high page-specific logic, or other structure that should not be generalized solely from the pilot.

### GROUP C — special shell/auth/security

`login.html`, `change-password.html`, `profile.html`, `admin.html`, `audit-log.html`, `master-data.html`, `portal-management.html`, `core-permission.html`.

These require separate security-aware treatment.

### GROUP D — high-risk / defer

`agreement-service.html`, `asset-facility.html`, `lounge-access.html`, `lounge-flights.html`, `lounge-list.html`, `lounge-procurement.html`, `lounge-purchase.html`, `lounge-visitor.html`, `core-foundation.html`, `core-history.html`, `core-master.html`, `core-migration.html`, `core-publication.html`, `core-relationships.html`, `core-shared.html`.

These are deferred because of P29/P39/business-critical or unusual architectural coupling.

## 21. Runtime change summary

| Category | Change |
|---|---:|
| Pilot HTML modified | 3 |
| Non-pilot HTML modified | 0 |
| `assets/portal.css` modified | 0 |
| `assets/portal-shell.js` modified | 0 |
| Business JS modified | 0 |
| Authentication modified | 0 |
| Netlify Functions modified | 0 |
| Firestore modified | 0 |
| Templates modified | 0 |
| Templates deleted | 0 |
| Business logic changed | 0 |
| Visual redesign | 0 |
| Routes changed | 0 |
| Production deployment | 0 |

## 22. File/hash result

P40B-2 baseline: **215 files**.

P40B-3A repository after implementation/evidence: **221 files**.

The six additional files are the dedicated P40B-3A shell-contract test, control hash evidence, protected-hash evidence, pilot report, shell-contract authority, and final hash-comparison evidence. No source file was deleted.

Exact baseline comparison:

- Runtime HTML modified: exactly the three pilot HTML pages.
- Documentation modified: `docs/README.md`, `docs/ARCHITECTURE_AUTHORITY.md`.
- Added: `tests/p40b3a-shared-shell-contract.js`, `tests/.p40b3a-control.sha256`, `docs/P40B-3A_PROTECTED_HASHES.txt`, `docs/P40B-3A_SHARED_SHELL_PILOT_REPORT.md`, `docs/P40B-3A_HASH_COMPARISON.txt`, `docs/SHARED_SHELL_CONTRACT.md`.
- Deleted: 0.

The exact SHA-256 comparison is stored in [P40B-3A_HASH_COMPARISON.txt](P40B-3A_HASH_COMPARISON.txt).

## 23. P40B-3B recommendation

**CONDITIONAL GO** for a future P40B-3B controlled rollout, subject to human review and browser/authenticated visual validation first.

Evidence supporting the recommendation:

- current runtime shell accepts minimal required hosts in all three pilot source contracts;
- portal-shell.js unchanged;
- portal.css unchanged;
- script order unchanged;
- page-owned content preserved;
- control page remained byte-identical;
- dedicated contract gate passed;
- full existing regression suite passed;
- local HTTP returned 200 for all pilots.

Limitation preventing an unconditional GO:

- browser-level hydrated DOM, visual equivalence, responsive behavior, and authenticated role/POV rendering were not available for direct validation in this environment.

A future P40B-3B must therefore begin with browser/authenticated validation and then proceed page-by-page. It must not become a mass search-and-replace operation.

## 24. Stop condition

P40B-3A is complete. No remaining HTML pages were modified.

No CSS consolidation, portal-shell.js cleanup, authentication change, Firestore change, template change, P29/P39 change, or production deployment was performed.

**STOP AND WAIT FOR HUMAN REVIEW.**
