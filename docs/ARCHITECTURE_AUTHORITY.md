# Current Architecture Authority

**Status:** CURRENT AUTHORITY — P40B-3A

This document describes the current architecture at a responsibility level. It does not authorize refactoring.

## Runtime architecture

The current portal is a **static / multi-page HTML application** composed of:

1. Physical `.html` pages.
2. Shared runtime shell in `assets/portal-shell.js`.
3. Shared presentation layer in `assets/p33-p37-presentation.js` and shared stylesheet authority in `assets/portal.css`.
4. Domain-specific page engines/modules in `assets/`.
5. Firebase browser integration through `assets/firebase-config.js` and `assets/firebase-client.js`.
6. Server-side Netlify Functions under `netlify/functions/`.
7. Firestore-backed data and existing compatibility layers.

The portal deliberately remains multi-page. There is no framework migration or SPA catch-all in P40B-1.

## Shared shell contract

The observed minimum HTML host contract for the current runtime shell is documented in [Shared Shell Contract](SHARED_SHELL_CONTRACT.md). P40B-3A validated this contract only through a maximum-three-page pilot. It does not authorize mass HTML consolidation.

## Shared runtime authorities

### `assets/portal-shell.js`

Treat this as an important **current runtime authority**, not as a disposable legacy file. It currently carries shared shell responsibilities including navigation, Role/POV behavior, sidebar behavior, account/notification integration, and historical compatibility/runtime logic.

P40A found multiple historical layers and repeated/overridden definitions inside this file. Those findings are documented for future work; the file is frozen in P40B-1.

### `assets/portal.css`

Treat this as the **current shared stylesheet authority**. P40A found historical token families and extensive cascade overrides, including substantial `!important` usage. These are audit findings, not permission to clean, split, or remove CSS in P40B-1.

## Authentication / authorization boundary

Firebase Authentication, Session Profile, Role, Access Level, Scope, Permissions, Dashboard POV, and Access Assistance are frozen. Server-side authorization and existing Firestore rules remain the security boundary. No generic documentation normalization may alter these areas.

## Data / Firestore authority

`firebase-schema.md` is the current repository data/schema reference. Existing collections and current P39 collections are frozen.

P39 ownership is:

**Station → Facility / Service Location → Asset**

with `geFacilities` and `geAssets`. Existing Lounge references remain distinct. Asset lifecycle remains independent from Agreement lifecycle.

## Domain ownership map

| Domain | Major current source files | Status |
|---|---|---|
| AUTH / ACCOUNT | `assets/auth.js`, `assets/profile-p27.js`, `assets/password-p27.js`, `assets/user-access-p26.js`, `netlify/functions/auth-*.js` | FROZEN |
| PLANNING | `planning-workspace.html`, `branch-office-planning.html`, `gaso-planning.html`, `planning-documents.html`, `assets/service-chain-v257.js` | FROZEN |
| LOUNGE / TENANT | `lounge-list.html`, `lounge-visitor.html`, `lounge-flights.html`, `lounge-procurement.html`, `assets/lounge-planning-v29.js`, `assets/agreement-v257.js` | FROZEN |
| CALENDAR / INITIATIVE | `calendar.html`, `inisiatif.html`, `initiative-conversion.html`, `initiative-traceability.html`, `assets/v257-initiative-grid-final.js`, `assets/v2554-stability.js` | FROZEN |
| READINESS / CAPABILITY | `readiness.html`, `service-capability.html`, `assets/readiness-v257.js` | FROZEN |
| STATION / SERVICE LOCATION | `network-stations.html`, `service-locations.html`, `station-360.html`, `assets/network-v257.js`, `assets/service-location-v257.js`, `assets/station-360-v257.js` | FROZEN |
| ASSET & FACILITY | `asset-facility.html`, `assets/asset-facility-p39.js`, `assets/p39-asset-config.json`, `netlify/functions/asset-facility.js` | FROZEN |
| BUDGET / COST | `budget-cost.html`, `cost-intelligence.html`, `assets/budget-cost-v257.js` | FROZEN |
| CONTENT / SUPPORT | `berita.html`, `kontak.html`, `layanan.html`, `assets/publication-v257.js`, `assets/access-assistance-p32.js` | FROZEN |
| ADMINISTRATION | `admin.html`, `master-data.html`, `portal-management.html`, `core-permission.html`, `audit-log.html`, `assets/permission-v257.js` | FROZEN |

This is intentionally a major-file map, not a duplicate of the P40A 204-file inventory.

## Current historical-layer rule

Current runtime contains historical compatibility layers. A historical layer inside a runtime file is **not** equivalent to an orphaned file. No layer is removed by P40B-1.

## Templates

Template authority is **NOT YET CONSOLIDATED**. P40A identified Airport Systems CSV/XLSX/V2, Lounge Visitor CSV/XLSX, Station Material CSV/XLSX, other contract-specific templates, and dynamic template generation. P40B-2 must determine canonical template authority after importer-level verification. P40B-1 does not choose, rename, move, or remove formats.

## Large runtime assets

Tesseract runtime assets, OCR language data, WASM, and `xlsx.full.min.js` are **KEEP UNTIL REFERENCE/USAGE VERIFIED**. Size alone is not evidence of waste. They are frozen in P40B-1.

## Architecture change authority

Future runtime changes must identify the affected domain, preserve the P39 baseline, and be authorized as a separate phase. P40B-1 itself is documentation-only.
