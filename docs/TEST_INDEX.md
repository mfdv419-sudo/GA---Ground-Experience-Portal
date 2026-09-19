# Test Index

**Status:** CURRENT AUTHORITY — P40B-1

Files under `tests/` are functionally **TESTS**, regardless of their `.js` extension. This corrects the P40A reporting taxonomy; test contents are unchanged.

| Test file | Phase / area | Purpose |
|---|---|---|
| `tests/p27-profile-self-service.js` | P27 | Profile / self-service contract |
| `tests/p29-lounge-planning.js` | P29 | Lounge / Tenant planning contract |
| `tests/p31-auth-role-runtime.js` | P31 | Authentication / role runtime contract |
| `tests/p31-authentication.js` | P31 | Authentication contract |
| `tests/p31a-session-profile-service.js` | P31A | Session Profile service contract |
| `tests/p31b-login-access-assistance.js` | P31B | Login / Access Assistance contract |
| `tests/p32-access-assistance-admin.js` | P32 | Access Assistance admin contract |
| `tests/p32-access-assistance-runtime.js` | P32 | Access Assistance runtime contract |
| `tests/p33-p37-presentation.js` | P33–P37 | Presentation stabilization contract |
| `tests/p38-repository-hygiene.js` | P38 | Repository hygiene gate |
| `tests/p39-asset-facility.js` | P39 | Asset & Facility contract |
| `tests/regression-audit.js` | Regression | Broad regression audit |

## Existing commands

The existing `package.json` remains authoritative for execution order and behavior.

- `npm run build` — package verification plus the existing regression/phase test chain.
- `npm run verify:repo` — repository hygiene verification.
- `npm run package:deploy` — generates the existing deployment artifact; this does not make the artifact canonical source.

P40B-1 does not modify tests or package scripts.
