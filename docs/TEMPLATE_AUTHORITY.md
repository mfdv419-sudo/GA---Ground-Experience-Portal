# Template Authority

**Status:** CURRENT AUTHORITY — P40B-2

This document is the single repository authority for user-facing template contracts. It records what users should download, what the current importer actually accepts, which files are source/reference data, and which contracts remain unresolved.

P40B-2 verifies contracts; it does **not** redesign business schemas. P39, P29 commercial semantics, authentication, Firestore, shared shell, CSS, and general runtime architecture remain frozen.

## Authority rules

1. **Canonical download** means the one user-facing template the current UI intends users to obtain for that contract.
2. **Accepted import** means a format that the current importer/parser can actually normalize for that contract. A file-picker extension alone is not proof of compatibility.
3. CSV compatibility is retained where it is currently proven and useful. XLSX is preferred as the canonical download only where the contract is proven equivalent and the current workflow supports it.
4. A source/reference workbook is not automatically an upload template.
5. **Unknown / keep** means no consolidation is authorized.
6. P40B-2 does not introduce new business schemas merely to make formats look consistent.

## Decision matrix

| Business contract | Purpose | Canonical download | Accepted import | Source/reference | Status |
|---|---|---|---|---|---|
| Airport Systems | CUTE/CUPPS systems master import | `templates/Template_Airport_Systems_V2.xlsx` | XLSX using the V2 header contract. The generic picker permits CSV, but the old CSV header is not compatible with the current V2 importer and is therefore **not documented as supported**. | `templates/Source_Daftar_Airport_Systems.xlsx` | **A — CANONICAL USER TEMPLATE**; old CSV/V1 XLSX retained as historical/unknown contracts |
| Lounge Visitor Bulk | Bulk lounge visitor import | Runtime-generated `Template_Lounge_Visitor_Bulk.xlsx` | XLSX + CSV | `templates/Template_Lounge_Visitor_Bulk.xlsx` is byte-identical to the runtime-generated workbook and retained as a support/fallback artifact; CSV is compatibility input. | **A + B** |
| Station Material | Station material master import | `templates/Template_Station_Material.csv` | CSV | `templates/Source_Barang_Cetak_Kestasiunan.xlsx` | **A — CANONICAL USER TEMPLATE**; XLSX retained because its combined-period schema is not equivalent to the current importer contract |
| Service Procurement | Branch Office service procurement import | `templates/Template_Service_Procurement.csv` | CSV | None | **A — CANONICAL USER TEMPLATE** |
| Space & Building | Branch Office space portfolio import | `templates/Template_Space_Building.csv` | CSV | None | **G — KEEP / CONTRACT REVIEW**; current importer expects `annualCost`, while the template supplies `Harga / m² / Bulan`; no consolidation is authorized |
| Airport Database | Airport master data import | `templates/Template_Database_Airport.xlsx` | XLSX + CSV when headers match the current importer aliases | None | **A — CANONICAL USER TEMPLATE** |
| Personnel | Personnel master import | `templates/Template_Data_Personil.xlsx` | XLSX + CSV when headers match the current importer aliases | None | **A — CANONICAL USER TEMPLATE** |
| GASO Master | GASO office master import | `templates/Template_GASO_Master.xlsx` | XLSX + CSV when headers match the current importer aliases | None | **A — CANONICAL USER TEMPLATE** |
| GASO Service Support | GASO support service import | `templates/Template_GASO_Service_Support.xlsx` | XLSX + CSV when headers match the current importer aliases | None | **A — CANONICAL USER TEMPLATE** |
| GASO Planning Service | GASO planning service import | `templates/Template_GASO_Planning_Service.xlsx` | XLSX + CSV when headers match the current importer aliases | None | **A — CANONICAL USER TEMPLATE** |
| Lounge / Tenant Master | General lounge/tenant master import | Runtime-generated `Template_Layanan_Lounge.xlsx` | XLSX + CSV using the generic lounge schema | `templates/Template_Layanan_Lounge.xlsx` is the matching static fallback artifact | **A — CANONICAL USER TEMPLATE** |
| P29 Lounge / Tenant Commercial Contract | Lounge/Tenant agreement + price-period import | Runtime-generated `Template_Layanan_Lounge_Tenant_P29.csv` | CSV | `templates/Template_Layanan_Lounge_Tenant_P29.csv` is also the static testable contract | **D — ACTIVE CONTRACT-SPECIFIC TEMPLATE** |
| Lounge/Tenant Flight Schedule | Lounge/Tenant flight schedule import | `templates/Template_Daftar_Penerbangan_Lounge_Tenant.csv` | CSV + XLSX when the eight-column parser contract is matched | None | **A — CANONICAL USER TEMPLATE**; no XLSX is generated in P40B-2 |
| Initiative Bulk Import | Initiative + Milestone bulk import | `assets/Template_Bulk_Import_Initiative_V2_55.xlsx` | XLSX + CSV through the V2554 import engine | None | **A — CANONICAL USER TEMPLATE**; current and unique |

## Airport Systems findings

Three historical/static files were compared:

- `Template_Airport_Systems.csv` — older generic eight-column contract (`Airport`, `Terminal`, `System`, `Provider`, `Counter / Unit`, `Availability`, `Contract / Agreement`, `Remark`).
- `Template_Airport_Systems.xlsx` — same older V1-style contract, with title/instruction rows before the data header.
- `Template_Airport_Systems_V2.xlsx` — current nine-column contract matching the current `airport-system-v231` importer aliases: `Airport`, `Self Baggage Drop (SBD)`, `Kiosk-K`, `Check-in`, `Boarding Gate`, `Transfer Desk`, `Provider`, `Area`, `Remarks`.

The current UI downloads V2. No active UI/runtime path was found for the old CSV or V1 XLSX. They are retained because the older contract is not proven semantically equivalent to V2. They are **not** approved for deletion by P40B-2.

`Source_Daftar_Airport_Systems.xlsx` is operational/reference data, not the current blank upload template.

## Lounge Visitor findings

`Template_Lounge_Visitor_Bulk.csv` and the runtime-generated `Template_Lounge_Visitor_Bulk.xlsx` expose the same nine logical fields. The static XLSX in `templates/` was byte-identical to the generated workbook before P40B-2; it is retained because the runtime generator still references the generated filename and the repository intentionally preserves the static artifact/fallback boundary.

The user-facing authority is the generated XLSX. CSV remains accepted compatibility input.

## Station Material findings

The CSV contains eight operational fields including separate `Mulai`, `Berakhir`, and `Dokumen` columns. The XLSX contains six columns and combines the period into `Jangka Waktu Perjanjian`; it does not expose separate start/end/document fields. The current importer aliases require the CSV-style separate date fields. Therefore the XLSX is **not** an equivalent replacement and remains KEEP/REVIEW.

`Source_Barang_Cetak_Kestasiunan.xlsx` is source/reference data containing populated master records and is not the blank user template.

## Space & Building finding

The current CSV exposes `Harga / m² / Bulan`, while `geImportSpaceV223()` expects an `annualCost` field. The importer therefore does not currently demonstrate a clean field-for-field contract for that cost value. P40B-2 does **not** reinterpret or silently repair the business meaning. The CSV remains the current download while the contract is explicitly marked for later controlled review.

## P29 protection

`Template_Layanan_Lounge_Tenant_P29.csv` remains an active P29-specific contract. Its 19 columns include agreement data plus price-period fields. The P29 importer is CREATE-only and groups repeated agreement numbers into price schedules. P40B-2 does not convert this commercial contract to XLSX and does not alter pricing/agreement semantics.

## Source/reference workbooks

The following are reference/source datasets rather than blank user upload templates:

- `templates/Source_Daftar_Airport_Systems.xlsx`
- `templates/Source_Barang_Cetak_Kestasiunan.xlsx`

They remain retained and must not be combined with blank upload templates without separate contract proof.

## Dynamic template generators

The template directory is not the sole authority. Current runtime generators include:

- Lounge Visitor XLSX generation in `assets/app.js`
- General Lounge Service XLSX generation in `assets/app.js`
- P29 Lounge/Tenant CSV generation in `assets/lounge-planning-v29.js`
- P26 User Account CSV generation in `assets/user-access-p26.js`
- Initiative XLSX download/import flow in `assets/v2554-stability.js`

The generated format and its importer must be considered together with any static file.

## Retained compatibility files

These CSV contracts remain intentionally retained for import compatibility or because they are the current canonical format:

- `templates/Template_Lounge_Visitor_Bulk.csv`
- `templates/Template_Station_Material.csv`
- `templates/Template_Service_Procurement.csv`
- `templates/Template_Space_Building.csv`
- `templates/Template_Daftar_Penerbangan_Lounge_Tenant.csv`
- `templates/Template_Layanan_Lounge_Tenant_P29.csv`
- `assets/user-access-p26.js` generated `User_Account_Access_Template_P26.csv`

Retention does not mean every CSV is a canonical download; the distinction is recorded in the matrix above.

## Consolidation result

**Templates deleted: 0.**

No static template was deleted merely because another format looked newer. The only clear duplicate candidate reviewed in detail — the static Lounge Visitor XLSX versus the runtime-generated XLSX — was retained because the runtime generator owns the user-facing download and still references the filename/fallback boundary. This is intentionally conservative.

P40B-2 therefore establishes authority and compatibility without forcing uncertain consolidation.
