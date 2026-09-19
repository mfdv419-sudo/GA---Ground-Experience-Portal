# Shared Shell Contract

**Status:** CURRENT AUTHORITY — P40B-3A pilot contract

This document defines the observed HTML host contract for the existing shared runtime shell. It does not authorize a mass HTML rollout.

## Runtime authority

`assets/portal-shell.js` remains the authoritative shared runtime shell. P40B-3A did not modify it.

The shell currently hydrates the following required direct body hosts on normal user pages:

```text
body
├── .top
└── .shell
    ├── .side
    └── .main
```

The exact selectors are derived from `ensureShell()` and `shell()` in `assets/portal-shell.js`:

- `body > .top`
- `body > .shell`
- `body > .shell > .side`
- `body > .shell > .main`

A missing host causes the current runtime shell to stop hydration for that page. P40B-3A therefore retains these hosts even when their static inner content is removed.

## Host ownership

### `.top`

Runtime-owned shared header. `portal-shell.js` replaces its contents with the current header, period selector, notifications, help, account menu, and sign-out controls.

Static duplicated header content may therefore be removed only where the same runtime contract is proven and the page is explicitly authorized as a pilot/rollout candidate.

### `.side`

Runtime-owned role-aware navigation. `portal-shell.js` replaces its contents using the current session/POV navigation contract and then applies sidebar behavior.

The role, access, scope, POV, navigation filtering, and permission implementations remain outside this consolidation wave and are frozen.

### `.shell`

Required structural parent. It remains page markup and must contain the `.side` and `.main` hosts in the observed contract.

### `.main`

Page-owned business-content host. P40B-3A does not move business content into the shared shell.

Calendar workspaces, planning forms, tables, charts, initiatives, station content, budget content, readiness/capability content, lounge content, and asset/facility content remain page-owned.

## Footer

Footer ownership was **not generalized** in P40B-3A. Pilot pages retain their existing footer where present. `portal-shell.js` does not establish a generic footer replacement contract equivalent to `.top` and `.side`.

Therefore footer removal is outside the pilot contract unless separately proven.

## Modal and dialog ownership

Page-specific modal/dialog hosts remain page-owned unless direct runtime evidence proves otherwise. The shell's modal normalization behavior is not treated as proof that modal content belongs to the shared shell.

## Script order

Pilot pages retain the existing script sequence. `assets/portal-shell.js` remains the final shared shell script in the observed pilot stack.

No script tags were removed, reordered, or converted.

## CSS

`assets/portal.css` remains unchanged and authoritative. No CSS change is required by the pilot.

## Failure/fallback behavior

The existing runtime depends on JavaScript for normal shared-shell hydration. A minimal `.top`/`.side` host therefore does not provide the former static header/sidebar fallback if JavaScript fails before hydration. This is an intentional observed consequence of the pilot, not a new authentication or no-JavaScript mechanism.

Browser-level visual and JavaScript-failure validation was not available in this environment and remains pending.

## P40B-3A pilot finding

Three pages successfully accepted the minimal host structure in static contract testing:

- `airport-systems.html`
- `kontak.html`
- `calendar.html`

Their page-specific `.main` content was preserved. Their existing script order and CSS/runtime references remained unchanged.

This is evidence for a controlled P40B-3B investigation, **not authorization for mass rollout**.

## Known exceptions

The following must not be assumed equivalent to the pilot pages without separate investigation:

- login/password/authentication pages;
- administration/security pages;
- P29 Lounge/Tenant commercial pages;
- P39 Asset & Facility;
- core/migration pages;
- pages with unusual shell hierarchy;
- pages with high inline-handler or page-specific shell coupling;
- pages that do not use the standard `.top`/`.shell`/`.side`/`.main` structure.
