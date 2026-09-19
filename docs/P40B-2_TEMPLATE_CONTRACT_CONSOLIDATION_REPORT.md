# P40B-2 — TEMPLATE CONTRACT VERIFICATION & SAFE CONSOLIDATION REPORT

**Status:** COMPLETE — P40B-2 / TEMPLATE CONTRACT ONLY

**Baseline:** finalized P40B-1 canonical repository only.

**P39:** LOCKED  
**P40A:** LOCKED  
**P40B-1:** LOCKED  
**Production deployment:** 0  
**Authenticated production/browser validation:** PENDING

---

## 1. Scope and change boundary

P40B-2 was limited to:

- template contract verification,
- static and dynamic template tracing,
- importer/download dependency tracing,
- canonical user-template determination,
- field-level CSV/XLSX comparison,
- conservative consolidation only where equivalence and dependency safety were proven,
- template-specific tests and documentation.

No HTML shell consolidation, CSS cleanup, `portal-shell.js` cleanup, authentication work, Firestore work, P29 business-model change, P39 Asset & Facility change, framework migration, or deployment was performed.

### Final consolidation decision

**Templates deleted: 0.**

The wave intentionally favors contract correctness over file-count reduction. Several files were identified as historical or non-equivalent candidates, but the evidence did not satisfy every deletion condition.

---

## 2. Baseline

| Measure | Before | After |
|---|---:|---:|
| Canonical repository files | 210 | 215 |
| `templates/` files | 19 | 19 |
| `templates/` size | 88,386 bytes | 88,386 bytes |
| Protected runtime/source files in SHA manifest | 176 | 176 |
| Protected runtime/source modified | 0 | 0 |
| Protected runtime/source added | 0 | 0 |
| Protected runtime/source deleted | 0 | 0 |

The five-file repository increase consists only of P40B-2 documentation/test evidence:

- `docs/TEMPLATE_AUTHORITY.md`
- `docs/P40B-2_TEMPLATE_CONTRACT_CONSOLIDATION_REPORT.md`
- `docs/P40B-2_RUNTIME_SOURCE_SHA256_BEFORE.txt`
- `docs/P40B-2_RUNTIME_SOURCE_SHA256_AFTER.txt`
- `tests/p40b2-template-contract.js`

No runtime or template file was added as part of the consolidation.

---

## 3. Importer trace model

The current tabular import stack in `assets/app.js` was traced as:

`file extension` → `geReadTabularFileV223()` → CSV/XLSX parser → `geFindHeaderRowV223()` → alias normalization → domain importer → normalized application object.

Important findings:

- CSV and XLSX both enter the same normalization path where the domain importer supports both.
- XLSX title/instruction rows are intentionally allowed before the data header; the current header detector searches the first 12 rows.
- The XLSX parser reads the first worksheet and resolves shared strings/inline strings.
- A file-picker `accept=".xlsx,.csv"` is **not sufficient evidence** that both formats satisfy the business contract. Header aliases and domain importer behavior determine actual compatibility.
- Dates and Excel serial values are normalized by existing upload normalization functions.
- No production Firestore writes were used for P40B-2 verification.

---

## 4. Canonical download versus accepted import

P40B-2 explicitly separates:

**Canonical Download** — what the UI tells a user to download.

**Accepted Import** — what the actual parser/importer can normalize for the contract.

Therefore, a CSV may remain accepted input even where XLSX is the canonical download. Conversely, a UI that accepts a `.csv` extension does not make an incompatible historical CSV schema an accepted contract.

---

## 5. Template decision matrix

| Contract | Canonical download | Accepted imports | Classification | Consolidation result |
|---|---|---|---|---|
| Airport Systems | `Template_Airport_Systems_V2.xlsx` | XLSX V2 contract | A | V2 retained; old CSV/V1 retained |
| Lounge Visitor Bulk | runtime-generated `Template_Lounge_Visitor_Bulk.xlsx` | XLSX + CSV | A/B | no deletion |
| Station Material | `Template_Station_Material.csv` | CSV | A | XLSX retained as non-equivalent |
| Service Procurement | `Template_Service_Procurement.csv` | CSV | A | retained |
| Space & Building | `Template_Space_Building.csv` | CSV | G | retained; contract review required |
| Airport Database | `Template_Database_Airport.xlsx` | XLSX + matching CSV headers | A | retained |
| Personnel | `Template_Data_Personil.xlsx` | XLSX + matching CSV headers | A | retained |
| GASO Master | `Template_GASO_Master.xlsx` | XLSX + matching CSV headers | A | retained |
| GASO Service Support | `Template_GASO_Service_Support.xlsx` | XLSX + matching CSV headers | A | retained |
| GASO Planning Service | `Template_GASO_Planning_Service.xlsx` | XLSX + matching CSV headers | A | retained |
| Lounge/Tenant Master | runtime-generated `Template_Layanan_Lounge.xlsx` | XLSX + matching CSV headers | A | static fallback retained |
| P29 Lounge/Tenant Commercial | runtime-generated `Template_Layanan_Lounge_Tenant_P29.csv` | CSV | D | protected; no conversion |
| Lounge/Tenant Flight Schedule | `Template_Daftar_Penerbangan_Lounge_Tenant.csv` | CSV + XLSX matching parser aliases | A | no XLSX generated |
| Initiative Bulk Import | `assets/Template_Bulk_Import_Initiative_V2_55.xlsx` | XLSX + CSV through current engine | A | retained |
| Source Barang Cetak | reference workbook | N/A | C | retained |
| Source Airport Systems | reference workbook | N/A | C | retained |
| Airport Systems V1 XLSX | historical generic system template | not proven current | G | retained |
| Airport Systems old CSV | historical generic system template | not compatible with V2 aliases | G | retained |
| Station Material XLSX | alternate combined-period workbook | not equivalent to current CSV importer | G | retained |

---

## 6. Airport Systems — detailed trace

### Current authority

`branch-office-planning.html` downloads:

`templates/Template_Airport_Systems_V2.xlsx`

The current `airport-system-v231` importer aliases are:

- Airport
- Self Baggage Drop (SBD)
- Kiosk-K
- Check-in
- Boarding Gate
- Transfer Desk
- Provider
- Area
- Remarks

The V2 workbook has exactly those nine data columns at its actual header row after title/instruction rows.

### Historical variants

`Template_Airport_Systems.csv` and `Template_Airport_Systems.xlsx` use the older eight-column concept:

- Airport
- Terminal
- System
- Provider
- Counter / Unit
- Availability
- Contract / Agreement
- Remark

That is not field-equivalent to V2. The old CSV is therefore **not documented as an accepted V2 import**, even though the generic file picker path can mention CSV.

### Source workbook

`Source_Daftar_Airport_Systems.xlsx` is populated reference/source data. Its header is located below a title row and represents the source list of CUTE/CUPPS information. It is not the blank user upload template.

### Decision

**Canonical:** V2 XLSX.  
**Accepted:** V2 XLSX.  
**Old CSV/V1 XLSX:** KEEP — contract not proven equivalent.  
**Deleted:** none.

---

## 7. Lounge Visitor Bulk — detailed trace

The current runtime generator in `assets/app.js` produces:

`Template_Lounge_Visitor_Bulk.xlsx`

with these nine columns:

- Tanggal
- Waktu
- Nama Penumpang
- Flight Number
- Sequence
- Airport
- Nama Lounge
- Kategori Penumpang
- Referensi Eligibility

The static XLSX in `templates/` was byte-identical to the generated workbook during verification. The static artifact is retained because the runtime code owns the filename/generator boundary and the repository keeps the static workbook as a support/fallback artifact.

`Template_Lounge_Visitor_Bulk.csv` contains the same nine logical fields and remains accepted compatibility input.

### Decision

**Canonical:** runtime-generated XLSX.  
**Accepted:** XLSX + CSV.  
**Retained compatibility:** CSV.  
**Deleted:** none.

---

## 8. Station Material — detailed trace

The current UI downloads:

`templates/Template_Station_Material.csv`

The CSV has eight operational fields, including separate:

- Mulai
- Berakhir
- Dokumen

The XLSX has six columns:

- Kode Barang
- Nama Barang Cetak Kestasiunan
- Area
- Vendor
- Jangka Waktu Perjanjian
- Status

The current importer aliases require separate start/end fields. The XLSX therefore cannot be substituted safely without changing the contract/import behavior.

`Source_Barang_Cetak_Kestasiunan.xlsx` is a populated reference dataset and is not the blank import template.

### Decision

**Canonical:** CSV.  
**Accepted:** CSV.  
**Retained XLSX:** non-equivalent/unknown.  
**Deleted:** none.

---

## 9. Service Procurement

The active importer schema `service-procurement-v243` was found and traced to `geImportServiceProcurementV243()`.

The current static CSV fields map to:

- Airport
- Kategori Layanan
- Nama Service / Provider
- Currency
- Harga / Pax
- Tanggal Mulai
- Tanggal Berakhir
- Nomor Dokumen
- Jenis Dokumen
- Status Dokumen
- Remarks

No compatible XLSX contract was found, so P40B-2 does not manufacture one.

### Decision

**Canonical:** CSV.  
**Accepted:** CSV.  
**Deleted:** none.

---

## 10. Space & Building

The current CSV provides:

`Harga / m² / Bulan`

while the current importer maps:

`annualCost`

The importer also expects `sizeM2`, start/end dates, currency, status and document reference. The price-field semantic mismatch means a clean end-to-end contract equivalence has **not** been proven.

P40B-2 therefore does not alter the importer or redesign the template.

### Decision

**Canonical download:** current CSV because it is the active user-facing artifact.  
**Contract status:** G — UNKNOWN / KEEP pending controlled contract clarification.  
**Deleted:** none.

---

## 11. P29 Lounge/Tenant commercial contract

`Template_Layanan_Lounge_Tenant_P29.csv` remains an active contract-specific template.

The contract includes 19 columns covering:

- station/provider/service type,
- agreement fields,
- base price,
- and multi-period price schedule fields.

The P29 importer remains CREATE-only and groups repeated agreement numbers into price schedules. P40B-2 does not change those semantics.

### Decision

**Canonical:** runtime-generated P29 CSV.  
**Accepted:** CSV.  
**Retained:** static P29 CSV because it is part of the contract/test evidence.  
**Deleted:** none.

---

## 12. Flight / Lounge Tenant

`Template_Daftar_Penerbangan_Lounge_Tenant.csv` matches the flight importer aliases:

Flight, From, To, Tanggal, STD, ETD, Capacity, Status.

The importer can parse XLSX through the shared tabular reader when the same header contract is supplied, but there is no dedicated XLSX template. P40B-2 does not create one merely for format consistency.

### Decision

**Canonical:** CSV.  
**Accepted:** CSV and matching XLSX input.  
**Deleted:** none.

---

## 13. Unique XLSX contracts

The following remain current/unique and were not converted or removed:

- `Template_Data_Personil.xlsx`
- `Template_Database_Airport.xlsx`
- `Template_GASO_Master.xlsx`
- `Template_GASO_Planning_Service.xlsx`
- `Template_GASO_Service_Support.xlsx`
- `Template_Layanan_Lounge.xlsx`

They use the existing title/instruction/header-row structure and remain compatible with the shared tabular parser where the corresponding importer aliases exist.

---

## 14. Initiative template

`assets/Template_Bulk_Import_Initiative_V2_55.xlsx` remains the current Initiative bulk-import workbook.

The V2554 runtime flow explicitly advertises XLSX plus CSV upload and the XLSX workbook supports the Initiatives + Milestones structure. P40B-2 does not change Initiative business logic or this template.

---

## 15. Complete template classification

### A — CANONICAL USER TEMPLATE

- `templates/Template_Airport_Systems_V2.xlsx`
- `templates/Template_Lounge_Visitor_Bulk.xlsx` / runtime-generated equivalent
- `templates/Template_Station_Material.csv`
- `templates/Template_Service_Procurement.csv`
- `templates/Template_Database_Airport.xlsx`
- `templates/Template_Data_Personil.xlsx`
- `templates/Template_GASO_Master.xlsx`
- `templates/Template_GASO_Service_Support.xlsx`
- `templates/Template_GASO_Planning_Service.xlsx`
- `templates/Template_Layanan_Lounge.xlsx` / runtime-generated equivalent
- `templates/Template_Daftar_Penerbangan_Lounge_Tenant.csv`
- `assets/Template_Bulk_Import_Initiative_V2_55.xlsx`

### B — SUPPORTED IMPORT COMPATIBILITY

- `templates/Template_Lounge_Visitor_Bulk.csv`
- matching CSV/XLSX inputs accepted by shared importer contracts where no separate user-facing template is offered.

### C — SOURCE / REFERENCE DATA

- `templates/Source_Barang_Cetak_Kestasiunan.xlsx`
- `templates/Source_Daftar_Airport_Systems.xlsx`

### D — ACTIVE CONTRACT-SPECIFIC TEMPLATE

- `templates/Template_Layanan_Lounge_Tenant_P29.csv`

### E — SUPERSEDED STATIC TEMPLATE, SAFE CANDIDATE

**None approved for deletion in P40B-2.**

### F — LEGACY BUT STILL REFERENCED

**None conclusively classified as F.**

### G — UNKNOWN / KEEP

- `templates/Template_Airport_Systems.csv`
- `templates/Template_Airport_Systems.xlsx`
- `templates/Template_Station_Material.xlsx`
- `templates/Template_Space_Building.csv`

The G classification deliberately prevents format-only deletion.

---

## 16. Files changed

### Documentation added

- `docs/TEMPLATE_AUTHORITY.md`
- `docs/P40B-2_TEMPLATE_CONTRACT_CONSOLIDATION_REPORT.md`
- `docs/P40B-2_RUNTIME_SOURCE_SHA256_BEFORE.txt`
- `docs/P40B-2_RUNTIME_SOURCE_SHA256_AFTER.txt`

### Tests added

- `tests/p40b2-template-contract.js`

### Documentation updated

- `docs/README.md` — added Template Authority pointer.
- `docs/USER_IMPORT_FORMAT.md` — clarified that it is the P26 User Account import authority and points business-domain templates to `TEMPLATE_AUTHORITY.md`.

### Runtime/template changes

**None.**

No CSV, XLSX, HTML, CSS, runtime JavaScript, Netlify Function, Firebase, Firestore, authentication, or business-domain file was changed.

---

## 17. Files deleted

**None.**

The Lounge Visitor static XLSX was investigated as a duplicate of the runtime-generated canonical XLSX. It was retained because the runtime generator still owns the generated filename/fallback boundary. The conservative result is therefore zero deletion.

---

## 18. Retained CSV compatibility

The following are intentionally retained and must not be removed by future cleanup agents merely because XLSX exists elsewhere:

- `Template_Lounge_Visitor_Bulk.csv` — CSV compatibility input.
- `Template_Station_Material.csv` — current canonical format.
- `Template_Service_Procurement.csv` — current canonical format; no proven XLSX replacement.
- `Template_Space_Building.csv` — current user-facing format pending contract review.
- `Template_Daftar_Penerbangan_Lounge_Tenant.csv` — current canonical format.
- `Template_Layanan_Lounge_Tenant_P29.csv` — protected P29 contract.
- P26 runtime-generated user account CSV — separate authentication/access contract.

---

## 19. Runtime/source hash verification

A SHA-256 manifest was captured before P40B-2 changes for all protected repository files outside `docs/` and `tests/`.

| Result | Count |
|---|---:|
| Protected files before | 176 |
| Protected files after | 176 |
| Added | 0 |
| Deleted | 0 |
| Modified | 0 |

The before and after protected-source hashes are identical.

Evidence:

- `docs/P40B-2_RUNTIME_SOURCE_SHA256_BEFORE.txt`
- `docs/P40B-2_RUNTIME_SOURCE_SHA256_AFTER.txt`

---

## 20. Tests and verification

### New P40B-2 gate

`node tests/p40b2-template-contract.js`

**Result:** `P40B2_TEMPLATE_CONTRACT_PASS`

The test verifies actual repository contract evidence including:

- CSV/XLSX parser paths,
- real XLSX header-row recognition,
- Airport Systems V2 header contract,
- Lounge Visitor CSV/XLSX equivalence,
- Station Material CSV/XLSX non-equivalence,
- Space & Building cost-field mismatch detection,
- Service Procurement importer presence,
- P29 contract headers/generator,
- Flight template contract,
- unique XLSX contract presence,
- Initiative template presence,
- static HTML template-download references.

### Existing regression suite

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

### Package verification

`npm run package:deploy` completed with:

`P38_DEPLOYMENT_ARTIFACT_PASS`

The generated deployment artifact was removed after verification. No production deployment occurred.

---

## 21. Runtime change report

| Protected area | Changed |
|---|---:|
| HTML files | 0 |
| Shared CSS | 0 |
| Runtime JavaScript | 0 |
| Netlify Functions | 0 |
| Templates modified | 0 |
| Templates deleted | 0 |
| Media assets | 0 |
| Firebase configuration | 0 |
| Firestore rules | 0 |
| Firestore data | 0 |
| Authentication | 0 |
| Session Profile | 0 |
| Role / Access / Scope / Permissions | 0 |
| P29 commercial logic | 0 |
| P39 Asset & Facility | 0 |
| Business logic | 0 |
| UI redesign | 0 |
| Production deployments | 0 |

---

## 22. Unresolved contracts

The following remain intentionally unresolved rather than being forced into a new format:

1. **Airport Systems old CSV/V1 XLSX** — historical contract differs from V2.
2. **Station Material XLSX** — combined agreement period and omitted document field differ from current CSV importer contract.
3. **Space & Building cost field** — template expresses monthly price per square metre while importer expects `annualCost`.
4. **General XLSX-vs-CSV compatibility for contracts with only one static format** — generic parser capability is not treated as a reason to manufacture new templates.

These are candidates for future controlled work only after contract ownership confirms the intended business schema.

---

## 23. Browser and production status

No authenticated production/browser validation was claimed.

**BROWSER / AUTHENTICATED PRODUCTION = PENDING**

**PRODUCTION DEPLOYMENT = 0**

The corporate-managed-device Node.js / Netlify CLI limitation remains unchanged. No local authentication bypass or SuperAdmin bypass was introduced.

---

## 24. P40B-2 final status

**P40B-2 = COMPLETE / TEMPLATE CONTRACT ONLY**

Established:

- one documented canonical download authority per currently verified business contract,
- explicit accepted-import formats,
- retained CSV compatibility where applicable,
- source/reference separation,
- P29 commercial-template protection,
- unique XLSX preservation,
- unresolved-contract protection,
- dedicated template-contract verification,
- zero protected runtime/source changes.

**No P40B-3 work has started.**

P40B-3 HTML consolidation remains separately authorized work and must not be started automatically.

> **STOP CONDITION:** P40B-2 is complete. Stop and wait for human review.
