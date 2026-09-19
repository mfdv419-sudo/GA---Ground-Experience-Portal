#!/usr/bin/env node
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/[\\/]$/, '');
const out = join(root, 'artifacts', 'netlify-deploy');

const required = [
  'assets',
  'templates',
  'netlify',
  'tools/verify-package.mjs',
  'tests/regression-audit.js',
  'tests/p29-lounge-planning.js',
  'tests/p31-authentication.js',
  'tests/p31-auth-role-runtime.js',
  'tests/p31a-session-profile-service.js',
  'tests/p31b-login-access-assistance.js',
  'tests/p32-access-assistance-admin.js',
  'tests/p32-access-assistance-runtime.js',
  'tests/p33-p37-presentation.js',
  'tests/p27-profile-self-service.js',
  'tests/p38-repository-hygiene.js',
  'package.json',
  'package-lock.json',
  'netlify.toml',
  'firebase.json',
  'firestore.rules',
  '_headers'
];

const rootFiles = [
  'index.html'
];

const htmlFiles = [];
for (const name of await readdir(root)) {
  if (name.endsWith('.html')) htmlFiles.push(name);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const rel of [...required, ...rootFiles, ...htmlFiles]) {
  const src = join(root, rel);
  if (!existsSync(src)) throw new Error(`Required deployment path missing: ${rel}`);
  const dest = join(out, rel);
  await mkdir(dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true });
}

const manifest = {
  artifact: 'netlify-deploy-source',
  source: 'canonical repository root',
  excludedByDesign: ['docs', 'README.md', 'README.txt', 'START_HERE.txt', 'START_PORTAL.bat', 'START_PORTAL.ps1', '.env.example', '.gitignore'],
  note: 'This artifact is generated from canonical source. It is not a separately maintained application source.'
};
await writeFile(join(out, 'DEPLOYMENT_ARTIFACT_MANIFEST.json'), JSON.stringify(manifest, null, 2)+'\n');
console.log(`P38_DEPLOYMENT_ARTIFACT_PASS ${relative(root,out)}`);
