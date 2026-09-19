# Repository Classification Index

**Status:** CURRENT AUTHORITY — P40B-1

This is a lightweight orientation index. The detailed P40A inventory remains the file-level inventory authority.

| Category | Primary location / examples | Authority status |
|---|---|---|
| RUNTIME HTML | `*.html` | Runtime; frozen |
| RUNTIME SHARED CSS | `assets/portal.css` | Current shared stylesheet authority; frozen |
| RUNTIME SHARED JS | `assets/portal-shell.js`, `assets/p33-p37-presentation.js`, shared integration modules | Runtime; frozen |
| DOMAIN JS | `assets/*` domain modules | Runtime; frozen |
| AUTH / SECURITY | `assets/auth.js`, profile/password/access modules, `netlify/functions/auth-*`, permission modules | Critical; frozen |
| NETLIFY FUNCTIONS | `netlify/functions/*.js` | Server runtime; frozen |
| TEMPLATES | `templates/`, runtime template asset(s), dynamic generators | Business contract; frozen |
| TESTS | `tests/*.js` | **TEST FILES**, not ordinary application JavaScript |
| TOOLING | `tools/*.mjs`, `START_PORTAL.*`, package scripts | Developer tooling; frozen |
| CONFIGURATION | `package.json`, `package-lock.json`, `netlify.toml`, `firebase.json`, `firestore.rules`, `_headers`, `.env.example` | Configuration; frozen |
| CURRENT DOCUMENTATION | `README.md`, `LOCAL_DEVELOPMENT.md`, `docs/README.md`, authority/index docs, `firebase-schema.md` | Current/supporting documentation |
| PHASE HISTORY | `docs/P22*` through `docs/P39*`, revision/changelog/audit records | Historical authority trail; preserve |
| MEDIA / THIRD-PARTY RUNTIME ASSETS | `assets/*.jpg`, `*.png`, `*.webp`, Tesseract/OCR/WASM, XLSX library | Runtime/support assets; keep until usage verified |

## File-count baseline

P40A recorded **204 canonical repository files**. P40B-1 does not optimize for a lower count. New documentation/index files may increase the count while improving authority clarity.

## Documentation status guidance

- **CURRENT AUTHORITY:** source for current behavior/architecture/process.
- **SUPPORTING REFERENCE:** useful context; does not supersede current authority.
- **PHASE HISTORY:** approved checkpoint record.
- **HISTORICAL AUDIT TRAIL:** prior audit/verification evidence.
- **DEPRECATED DOCUMENTATION CANDIDATE:** future review only; not a deletion authorization.
- **UNKNOWN / KEEP:** retain until verified.

## Protected runtime boundary

P40B-1 permits documentation changes only. No runtime file is being consolidated, deleted, renamed, moved, or rewritten.
