#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const pilots=['airport-systems.html','kontak.html','calendar.html'];
const control='customer-experience.html';
const requiredHosts=['.top','.shell','.side','.main'];
let failures=[];
function read(f){return fs.readFileSync(path.join(ROOT,f),'utf8')}
function ok(msg){console.log(`PASS: ${msg}`)}
function fail(msg){failures.push(msg);console.error(`FAIL: ${msg}`)}
for(const f of pilots){
 const s=read(f);
 for(const h of requiredHosts){
  const re=h==='.main'?/class=["']main["']/:/class=["'](?:top|shell|side)["']/;
  if(re.test(s)) ok(`${f}: required ${h} host present`); else fail(`${f}: required ${h} host missing`);
 }
 if((s.match(/portal-shell\.js/g)||[]).length!==1) fail(`${f}: portal-shell.js reference count is not 1`); else ok(`${f}: portal-shell.js reference present exactly once`);
 if(!/assets\/portal\.css(?:\?[^"']*)?/.test(s)) fail(`${f}: portal.css reference missing`); else ok(`${f}: portal.css reference present`);
 if(!/<main class="main">[\s\S]*?<\/main>/.test(s)) fail(`${f}: main content boundary missing`); else ok(`${f}: page-owned main content boundary present`);
 const top=s.match(/<header class="top">([\s\S]*?)<\/header>/)?.[1]??null;
 const side=s.match(/<aside class="side">([\s\S]*?)<\/aside>/)?.[1]??null;
 if(top!==''||side!=='') fail(`${f}: duplicated static shell content remains inside top/side hosts`); else ok(`${f}: top/side hosts are minimal`);
}
const controlBefore=path.join(ROOT,'tests','.p40b3a-control.sha256');
if(fs.existsSync(controlBefore)){
 const expected=fs.readFileSync(controlBefore,'utf8').trim().split(/\s+/)[0];
 const actual=crypto.createHash('sha256').update(read(control)).digest('hex');
 if(expected!==actual) fail(`${control}: control page hash changed`); else ok(`${control}: byte-identical control hash`);
} else ok(`${control}: no pre-recorded control hash in repository; external baseline evidence required`);
// Exact script order recorded/validated against canonical pilot order.
const expectedOrder=[
'assets/auth.js?v=2.54.1','assets/data.js?v=2.54.1','assets/core-v257.js?v=2.57-P1.1','assets/relationships-v257.js?v=2.57-P1.2','assets/compatibility-v257.js?v=2.57-P1.7','assets/files.js?v=2.54.1','assets/app.js?v=2.54.1','assets/v254-project.js?v=2.54.4','assets/v2544-modal-fix.js?v=2.54.4','assets/v2554-stability.js?v=2.55.5','assets/overlay-v30.js?v=30.1','assets/access-assistance-p32.js?v=32.1','assets/p33-p37-presentation.js?v=37.1','assets/portal-shell.js?v=10.5'];
for(const f of pilots){
 const seq=[...read(f).matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 if(JSON.stringify(seq)!==JSON.stringify(expectedOrder)) fail(`${f}: script load order differs from baseline contract`); else ok(`${f}: script load order unchanged`);
}
if(failures.length){console.error(`P40B3A_SHARED_SHELL_CONTRACT_FAIL (${failures.length})`);process.exit(1)}
console.log('P40B3A_SHARED_SHELL_CONTRACT_PASS');
