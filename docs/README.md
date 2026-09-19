# Repository Documentation Authority

**Status:** CURRENT AUTHORITY — P40B-1

This index is the first place to look for repository orientation. It establishes where current documentation lives without changing runtime code or business behavior.

## Canonical source

The canonical development source is the **P39-derived development repository after approved P40B-1 documentation-only normalization**.

- Generated deployment artifacts are **not** canonical source.
- Old ZIP packages are **not** canonical source.
- `artifacts/` output, when generated, is disposable deployment output and is not a second editable source tree.

## Current operational documentation

- [Repository Documentation Authority](README.md) — this index; current navigation point.
- [Architecture Authority](ARCHITECTURE_AUTHORITY.md) — current runtime architecture, authority boundaries, frozen areas, and domain ownership.
- [Shared Shell Contract](SHARED_SHELL_CONTRACT.md) — observed minimum HTML host contract for the current shared runtime shell; P40B-3A pilot authority.
- [Repository Classification](REPOSITORY_CLASSIFICATION.md) — lightweight functional classification of the repository.
- [Test Index](TEST_INDEX.md) — current test files, phase coverage, and commands.
- [Template Authority](TEMPLATE_AUTHORITY.md) — canonical downloads, accepted imports, source/reference files, and unresolved template contracts.
- [Local Development](../LOCAL_DEVELOPMENT.md) — current local workflow and production-parity constraints.
- [Firebase Schema](../firebase-schema.md) — current data/schema reference; Firestore behavior is frozen during P40B-1.

## Current deployment documentation

- [README.md](../README.md) — repository entry point and deployment model summary.
- `netlify.toml` — deployment configuration authority; frozen in P40B-1.
- [Deployment & Data Compatibility](DEPLOYMENT_AND_DATA_COMPATIBILITY.md) — supporting deployment/data compatibility gate.

## Phase history / audit trail

Phase reports remain valuable historical records and are **not** automatically deprecated or deleted.

- [P22/P23/P24](P22_P23_P24_REPORT.md)
- [P26/P28/P30](P26_P28_P30_REPORT.md)
- [P27](P27_PROFILE_SELF_SERVICE_REPORT.md)
- [P29](P29_REPORT.md)
- [P31](P31_AUTHENTICATION_REPORT.md)
- [P31A](P31A_SESSION_PROFILE_REPORT.md)
- [P31B](P31B_LOGIN_BRANDING_ACCESS_ASSISTANCE.md)
- **P32** — runtime/test history is indexed in [TEST_INDEX.md](TEST_INDEX.md); no standalone P32 phase report is present under this filename.
- [P33–P37](P33_P34_P35_P36_P37_PRESENTATION_STABILIZATION_REPORT.md)
- [P38](P38_PRODUCTION_PARITY_REPOSITORY_OPTIMIZATION_REPORT.md)
- [P39](P39_ASSET_FACILITY_REPORT.md)
- [Refactor Audit](REFACTOR_AUDIT.md)
- [Refactor Changelog](REFACTOR_CHANGELOG.md)
- [R10.20 Revision Notes](REVISION_NOTES_R10_20.md)
- [Final Audit Report](FINAL_AUDIT_REPORT.md)

### P40A detailed audit

The detailed P40A audit remains the authoritative audit baseline for consolidation decisions. Its handoff artifacts were produced outside this canonical source tree:

- `P40A_ARCHITECTURE_LEGACY_TEMPLATE_CONSOLIDATION_AUDIT.md`
- `P40A_FILE_INVENTORY.csv`
- `P40A_AUDIT_REPORTS.zip`

P40B-1 does not copy the large audit into `docs/`; this index records the authority and the artifact names so it is not confused with later implementation work.

## Documentation status model

Use these labels when classifying documentation:

- **CURRENT AUTHORITY** — current source for the stated subject.
- **SUPPORTING REFERENCE** — useful current reference that does not replace the authority document.
- **PHASE HISTORY** — records an approved implementation checkpoint.
- **HISTORICAL AUDIT TRAIL** — records a prior audit or validation result.
- **DEPRECATED DOCUMENTATION CANDIDATE** — identified for possible future review; deletion is not authorized by this label.
- **UNKNOWN / KEEP** — retained until its purpose is verified.

## P40B freeze

P40B-1 changes documentation only. HTML, CSS, JavaScript, Netlify Functions, Firebase/Firestore, templates, media, configuration, authentication, permissions, business logic, and deployment remain frozen.

**P40A consolidation candidates are recommendations only. No file is approved for deletion, merging, migration, or refactoring until P40A is reviewed and the relevant P40B wave is explicitly authorized.**
