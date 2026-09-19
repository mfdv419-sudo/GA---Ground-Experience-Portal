#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFileSync(join(root, file), 'utf8');
const fail = message => { console.error(`PACKAGE_VERIFY_FAIL: ${message}`); process.exitCode = 1; };

const pkg = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
if (lock.lockfileVersion !== 3) fail('root package-lock.json must use lockfileVersion 3');
if (lock.packages?.['']?.name !== pkg.name) fail('root package.json/package-lock.json name mismatch');
if (lock.packages?.['']?.version !== pkg.version) fail('root package.json/package-lock.json version mismatch');
for (const dep of Object.keys(pkg.dependencies || {})) {
  if (!lock.packages?.[`node_modules/${dep}`]) fail(`root dependency missing from package-lock.json: ${dep}`);
}
if (Object.keys(pkg.dependencies || {}).length) fail('root package should remain dependency-free; Netlify Function dependencies are isolated');
if (!pkg.scripts?.dev || !pkg.scripts?.preview || !pkg.scripts?.build) fail('dev/preview/build scripts are required');

const portalCss = read('assets/portal.css');
for (const selector of ['body.final-v257 .top','body.final-v257 .side','.ge-page-head','.ge-kpi-row','.ge-panel','.ge-form-grid','.modal-backdrop','.r9-portal-dialog']) {
  if (!portalCss.includes(selector)) fail(`portal visual contract missing: ${selector}`);
if (!portalCss.includes('.modal-backdrop{display:none')) fail('modal contract missing hidden-by-default state');
if (portalCss.length < 300000) fail(`portal.css unexpectedly small: ${portalCss.length} bytes`);
}

if (!portalCss.includes('P19A — PORTAL SHELL INTEGRITY LOCK')) fail('P19A shell integrity lock missing');
if (!portalCss.includes('--p19-header:72px')) fail('P19 header geometry lock missing');
if (!portalCss.includes('background:var(--p19-navy)!important')) fail('P19 header navy lock missing');
if (!portalCss.includes('background:linear-gradient(180deg,var(--p19-navy)')) fail('P19 sidebar navy lock missing');
if (!portalCss.includes('margin:0 0 0 var(--p19-side)!important')) fail('P19 main content offset lock missing');

const fnPkg = JSON.parse(read('netlify/functions/package.json'));
if (fnPkg.dependencies?.['firebase-admin'] !== '^13.5.0') fail('Netlify Functions firebase-admin dependency changed unexpectedly');
if (!existsSync(join(root, 'netlify/functions/package.json'))) fail('Netlify Functions package manifest missing');
if (!existsSync(join(root, 'netlify.toml'))) fail('netlify.toml missing');
const shellJs = read('assets/portal-shell.js');
if (!shellJs.includes("item('planning-workspace.html','Planning Workspace'")) fail('dynamic navigation missing Planning Workspace');
if (!shellJs.includes("item('planning-documents.html','Planning Documents'")) fail('dynamic navigation missing Planning Documents');
if (!shellJs.includes('const PLANNING_TABS')) fail('planning workspace tabs contract missing');
if (shellJs.includes("item('lounge-list.html','Lounge/Tenant Planning'")) fail('legacy Lounge/Tenant sidebar entry must be consolidated');
if (shellJs.includes("item('branch-office-planning.html','Branch Office Planning'")) fail('legacy Branch Office sidebar entry must be consolidated');
if (shellJs.includes("item('gaso-planning.html','GASO Planning'")) fail('legacy GASO sidebar entry must be consolidated');
if (!shellJs.includes('function dashboardPOV(s)')) fail('central dashboard POV resolver missing');
if (!shellJs.includes("if(r==='management')return 'management'")) fail('Management POV mapping missing');
if (!shellJs.includes("if(['ge team','ground experience team','head office','headoffice','staff'].includes(r))return 'ge-team'")) fail('GE Team POV mapping missing');
if (!shellJs.includes("if(['branch office','branchoffice','bo'].includes(r))return 'branch'")) fail('Branch Office POV mapping missing');
if (!shellJs.includes("if(r==='super admin'||r==='superadmin')return 'superadmin'")) fail('Super Admin POV mapping missing');
if (shellJs.includes("if(r==='super admin'||r==='superadmin'||r==='admin')return 'superadmin'")) fail('Legacy Admin must not fail open to Super Admin POV');

const dashboard = read('assets/dashboard-pov.js');
if (/['"]CGK['"]/.test(dashboard) && dashboard.includes("hardcode CGK")) fail('Dashboard contains a prohibited CGK assumption');
if (!dashboard.includes('Assigned station unavailable')) fail('Branch scope empty state missing');
if (!dashboard.includes('function assignedCodes')) fail('Branch station scope resolver missing');
if (!dashboard.includes('function unresolved')) fail('Unresolved role must not fall back to Management');
if (!existsSync(join(root, 'profile.html'))) fail('Profile destination missing');
if (!existsSync(join(root, 'planning-workspace.html'))) fail('Planning Workspace destination missing');
const p29 = read('assets/lounge-planning-v29.js');
if (!p29.includes('geP29ResolveLoungeServiceType')) fail('P29 service-type resolver missing');
if (!p29.includes('serviceCategory dan serviceType berbeda')) fail('P29 conflicting service-type guard missing');
if (!p29.includes('priceSchedules')) fail('P29 multi-period price model missing');
if (!p29.includes('CREATE-only')) fail('P29 CSV CREATE-only guard missing');
if (!p29.includes('Potential duplicate existing agreement')) fail('P29 duplicate detection missing');
if (!p29.includes('geP29AddPriceRow')) fail('P29 manual price-period input missing');
if (!existsSync(join(root, 'templates/Template_Layanan_Lounge_Tenant_P29.csv'))) fail('P29 CSV template missing');
if (!existsSync(join(root, 'assets/user-access-p26.js'))) fail('P26 user management workspace missing');
if (!existsSync(join(root, 'assets/page-identity-v28.js'))) fail('P28 page identity isolation module missing');
if (!existsSync(join(root, 'assets/overlay-v30.js'))) fail('P30 overlay module missing');
const p26 = read('assets/user-access-p26.js');
if (!p26.includes("ROLE_VALUES=['Management','Head Office','Branch Office']")) fail('P26 normal role contract missing');
if (p26.includes('<option>Super Admin</option>')) fail('P26 must not expose Super Admin as a creatable role');
if (!p26.includes('Temporary Password')) fail('P26 temporary password UI missing');
if (!p26.includes('Download Template')) fail('P26 user CSV template action missing');
if (!p26.includes('Import Users')) fail('P26 user CSV import workspace missing');
const p28 = read('assets/page-identity-v28.js');
if (!p28.includes('account-access-management') || !p28.includes('journey-touchpoint')) fail('P28 independent page identities missing');
const p30 = read('assets/overlay-v30.js');
if (!p30.includes('2147483000') || !p30.includes('p30-overlay-open')) fail('P30 overlay viewport/layer contract missing');
if (!portalCss.includes('.ge-p29-lounge-card')) fail('P29 card style missing');
if (!portalCss.includes('grid-template-columns:repeat(3,minmax(0,1fr))')) fail('P29 three-column card target missing');

const htmlFiles = readdirSync(root).filter(name => extname(name).toLowerCase() === '.html');
const missing = new Set();
for (const name of htmlFiles) {
  const html = read(name);
  const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(?:https?:|data:|mailto:|#|javascript:)/i.test(ref)) continue;
    if (ref.includes('${')) continue;
    const clean = ref.split('?')[0].split('#')[0];
    if (!clean || clean.endsWith('/')) continue;
    const target = join(root, clean);
    if (!existsSync(target)) missing.add(`${name} -> ${ref}`);
  }
}
for (const item of missing) fail(`missing local asset/reference: ${item}`);

try {
  execFileSync(process.execPath, ['--check', join(root, 'tools/serve.mjs')], { stdio: 'ignore' });
  execFileSync(process.execPath, ['--check', join(root, 'tools/verify-package.mjs')], { stdio: 'ignore' });
} catch { fail('tooling syntax check failed'); }

if (!process.exitCode) console.log('PACKAGE_VERIFY_PASS');
