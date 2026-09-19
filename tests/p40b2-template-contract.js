'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const bytes = rel => fs.readFileSync(path.join(root, rel));
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

function normalizeHeader(v) {
  return String(v ?? '').trim().toLowerCase()
    .replace(/[\/&]/g, ' ')
    .replace(/[()]/g, '')
    .replace(/[²]/g, '2')
    .replace(/\s+/g, ' ').replace(/\*$/,'');
}
function parseCsv(rel) {
  const text = read(rel).replace(/^\uFEFF/, '');
  const rows=[]; let row=[], cell='', q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(q){
      if(c==='"' && n==='"'){cell+='"'; i++;}
      else if(c==='"') q=false;
      else cell+=c;
    } else if(c==='"') q=true;
    else if(c===','){row.push(cell);cell='';}
    else if(c==='\n'){row.push(cell);rows.push(row);row=[];cell='';}
    else if(c!=='\r') cell+=c;
  }
  if(cell.length || row.length){row.push(cell);rows.push(row);}
  return rows;
}
function zipEntries(buf){
  const u=new Uint8Array(buf.buffer,buf.byteOffset,buf.byteLength);
  const dv=new DataView(u.buffer,u.byteOffset,u.byteLength);
  let eocd=-1;
  for(let i=u.length-22;i>=Math.max(0,u.length-65557);i--){
    if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}
  }
  assert(eocd>=0,'XLSX EOCD not found');
  const count=dv.getUint16(eocd+10,true), central=dv.getUint32(eocd+16,true);
  const out=new Map(); let p=central; const dec=new TextDecoder();
  for(let k=0;k<count;k++){
    assert(dv.getUint32(p,true)===0x02014b50,'XLSX central directory invalid');
    const method=dv.getUint16(p+10,true), comp=dv.getUint32(p+20,true), nameLen=dv.getUint16(p+28,true), extraLen=dv.getUint16(p+30,true), commentLen=dv.getUint16(p+32,true), local=dv.getUint32(p+42,true);
    const name=dec.decode(u.slice(p+46,p+46+nameLen));
    assert(dv.getUint32(local,true)===0x04034b50,'XLSX local header invalid');
    const ln=dv.getUint16(local+26,true), le=dv.getUint16(local+28,true), start=local+30+ln+le;
    const raw=Buffer.from(u.slice(start,start+comp));
    out.set(name,method===0?raw:zlib.inflateRawSync(raw));
    p+=46+nameLen+extraLen+commentLen;
  }
  return out;
}
function parseXlsx(rel){
  const entries=zipEntries(bytes(rel));
  const dec=new TextDecoder();
  const shared=[];
  if(entries.has('xl/sharedStrings.xml')){
    const xml=dec.decode(entries.get('xl/sharedStrings.xml'));
    for(const si of xml.matchAll(/<si[\s\S]*?<\/si>/g)) shared.push([...si[0].matchAll(/<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map(m=>m[1]).join(''));
  }
  const sheet=[...entries.keys()].find(k=>/^xl\/worksheets\/sheet1\.xml$/i.test(k)) || [...entries.keys()].find(k=>/^xl\/worksheets\/sheet\d+\.xml$/i.test(k));
  assert(sheet,`${rel}: worksheet missing`);
  const xml=dec.decode(entries.get(sheet));
  const rows=[];
  for(const rm of xml.matchAll(/<(?:\w+:)?row\b[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g)){
    const vals=[];
    for(const cm of rm[1].matchAll(/<(?:\w+:)?c\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/g)){
      const attrs=cm[1], body=cm[2];
      const ref=attrs.match(/\br="([A-Z]+\d+)"/i)?.[1]||'A1';
      const letters=(ref.match(/[A-Z]+/i)||['A'])[0].toUpperCase();
      let idx=0; for(const ch of letters) idx=idx*26+(ch.charCodeAt(0)-64); idx--;
      const type=attrs.match(/\bt="([^"]+)"/)?.[1]||'';
      const raw=body.match(/<(?:\w+:)?v[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1]??'';
      let val='';
      if(type==='inlineStr') val=[...body.matchAll(/<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map(m=>m[1]).join('');
      else if(type==='s') val=shared[Number(raw)]??'';
      else val=raw;
      vals[idx]=val;
    }
    rows.push(vals);
  }
  return rows;
}
function firstHeaderRow(rows, max=12){
  for(let i=0;i<Math.min(rows.length,max);i++){
    if((rows[i]||[]).some(v=>String(v??'').trim()!=='')) return i;
  }
  return -1;
}
function headerAt(rows, index){ return (rows[index]||[]).map(normalizeHeader).filter(Boolean); }
function findHeader(rows, expected){ const want=expected.map(normalizeHeader); let best=-1,bestHits=0; for(let i=0;i<rows.length;i++){ const h=headerAt(rows,i); const hits=want.filter(x=>h.includes(x)).length; if(hits>bestHits){bestHits=hits;best=i;} } return best; }
function exactSet(a,b){return a.length===b.length && a.every((v,i)=>v===b[i]);}
function sourceHas(rel, text){ return read(rel).includes(text); }

const app=read('assets/app.js');
assert(sourceHas('assets/app.js', "if(ext==='csv')return geParseCSVV223(await file.text());"), 'CSV parser path missing');
assert(sourceHas('assets/app.js', "if(ext==='xlsx')return geParseXLSXV223(file);"), 'XLSX parser path missing');
assert(sourceHas('assets/app.js', 'function geFindHeaderRowV223(rows,requiredAliases)'), 'real header-row detection function missing');
assert(sourceHas('assets/app.js', 'Math.min(rows.length,12)'), 'header scan must inspect workbook instruction/title rows');

const contracts={
  airportSystems:{csv:'templates/Template_Airport_Systems.csv', xlsx:'templates/Template_Airport_Systems_V2.xlsx', canonical:'xlsx', aliases:['airport','self baggage drop sbd','kiosk-k','check-in','boarding gate','transfer desk','provider','area','remarks']},
  loungeVisitor:{csv:'templates/Template_Lounge_Visitor_Bulk.csv', xlsx:null, canonical:'dynamic-xlsx', aliases:['tanggal','waktu','nama penumpang','flight number','sequence','airport','nama lounge','kategori penumpang','referensi eligibility']},
  stationMaterial:{csv:'templates/Template_Station_Material.csv', xlsx:'templates/Template_Station_Material.xlsx', canonical:'csv', aliases:['kode barang','nama barang cetak kestasiunan','area','provider','mulai','berakhir','status','dokumen']},
  spaceBuilding:{csv:'templates/Template_Space_Building.csv', xlsx:null, canonical:'csv', aliases:['airport','area location','function','size m2','harga / m2 / bulan','provider','start date','end date','currency','status','document / reference']},
  serviceProcurement:{csv:'templates/Template_Service_Procurement.csv', xlsx:null, canonical:'csv', aliases:['airport','kategori layanan','nama service / provider','currency','harga / pax','tanggal mulai','tanggal berakhir','nomor dokumen','jenis dokumen','status dokumen','remarks']},
  flightLoungeTenant:{csv:'templates/Template_Daftar_Penerbangan_Lounge_Tenant.csv', xlsx:null, canonical:'csv', aliases:['flight','from','to','tanggal','std','etd','capacity','status']},
  p29:{csv:'templates/Template_Layanan_Lounge_Tenant_P29.csv', xlsx:null, canonical:'dynamic-csv', aliases:['region','station','nama layanan / provider','jenis layanan','pic','mata uang','harga per pax','tanggal mulai','tanggal berakhir','nomor dokumen','jenis dokumen','status dokumen','remarks','price period effective from','price period effective to','price period price','price period currency','price basis','price period note']}
};

for(const [name,c] of Object.entries(contracts)){
  const csvRows=parseCsv(c.csv);
  assert(csvRows.length>0,`${name}: CSV unreadable`);
  let csvHeader=headerAt(csvRows, firstHeaderRow(csvRows));
  if(name==='p29') csvHeader=headerAt(csvRows,5);
  if(name==='spaceBuilding') assert(csvHeader.includes(normalizeHeader('harga / m² / bulan')),`${name}: price field missing`);
  if(name==='stationMaterial') assert(csvHeader.includes('dokumen'),`${name}: document column missing from CSV`);
  assert(fs.existsSync(path.join(root,c.csv)),`${name}: CSV missing`);
  if(c.xlsx){
    const xr=parseXlsx(c.xlsx); const hi=firstHeaderRow(xr); assert(hi>=0,`${name}: XLSX header missing`);
    const xh=headerAt(xr,findHeader(xr,c.aliases));
    if(name==='airportSystems') assert(exactSet(xh,c.aliases.map(normalizeHeader)),`${name}: V2 XLSX headers do not match current importer contract`);
    if(name==='stationMaterial') assert(!xh.includes('mulai') && !xh.includes('berakhir') && !xh.includes('dokumen'),`${name}: XLSX unexpectedly appears equivalent to CSV importer contract`);
  }
}

// Airport Systems: V2 is the only current downloadable contract and maps to the active importer schema.
assert(sourceHas('branch-office-planning.html','templates/Template_Airport_Systems_V2.xlsx'), 'Airport Systems must download V2 XLSX');
assert(sourceHas('assets/app.js', "'airport-system-v231':{title:'Upload Airport Systems terbaru.'" ) || sourceHas('assets/app.js', "'airport-system-v231':{title:'Upload Airport Systems"), 'Airport Systems current importer schema missing');
const airportAliases=['airport','self baggage drop sbd','kiosk-k','check-in','boarding gate','transfer desk','provider','area','remarks'].map(normalizeHeader);
const airportRows=parseXlsx('templates/Template_Airport_Systems_V2.xlsx');
const airportV2=headerAt(airportRows,findHeader(airportRows,airportAliases));
assert(exactSet(airportV2,airportAliases),'Airport Systems V2 header contract mismatch');
const airportCsv=headerAt(parseCsv('templates/Template_Airport_Systems.csv'),0);
assert(!exactSet(airportCsv,airportAliases),'Old Airport Systems CSV must not be treated as current V2 compatibility');

// Lounge Visitor: runtime-generated XLSX is the canonical user-facing download; the static XLSX is retained because runtime JS still references the generated filename and acts as the canonical fallback artifact.
const visitorCsv=headerAt(parseCsv('templates/Template_Lounge_Visitor_Bulk.csv'),0);
const visitorAlias=['tanggal','waktu','nama penumpang','flight number','sequence','airport','nama lounge','kategori penumpang','referensi eligibility'].map(normalizeHeader);
assert(exactSet(visitorCsv,visitorAlias),'Lounge Visitor CSV header mismatch');
const b64=app.match(/const GE_LOUNGE_VISITOR_TEMPLATE_B64_V225=([\'\"])(.*?)\1;/s)?.[2];
assert(b64,'Lounge Visitor dynamic XLSX generator missing');
const generated=Buffer.from(b64,'base64');
const staticVisitor=bytes('templates/Template_Lounge_Visitor_Bulk.xlsx');
assert(crypto.createHash('sha256').update(generated).digest('hex')===crypto.createHash('sha256').update(staticVisitor).digest('hex'),'Lounge Visitor static XLSX is not byte-identical to dynamic canonical XLSX');
assert(sourceHas('assets/app.js', "anchor.download='Template_Lounge_Visitor_Bulk.xlsx';"), 'Lounge Visitor canonical download generator missing');
// Station Material: CSV is canonical because current importer requires separate start/end fields; XLSX combines them and omits document.
assert(sourceHas('station-material.html','templates/Template_Station_Material.csv'), 'Station Material CSV download missing');
const smRows=parseXlsx('templates/Template_Station_Material.xlsx');
const smX=headerAt(smRows,findHeader(smRows,['Kode Barang','Nama Barang Cetak Kestasiunan','Area','Vendor','Jangka Waktu Perjanjian','Status']));
const smC=headerAt(parseCsv('templates/Template_Station_Material.csv'),0);
assert(smC.includes('mulai')&&smC.includes('berakhir')&&smC.includes('dokumen'),'Station Material CSV importer fields missing');
assert(smX.includes('jangka waktu perjanjian')&&!smX.includes('mulai')&&!smX.includes('dokumen'),'Station Material XLSX is not field-equivalent');

// Space & Building: importer currently expects annualCost but CSV supplies a monthly price field; contract is retained for review.
assert(sourceHas('assets/app.js', 'function geImportSpaceV223(rows)'), 'Space & Building importer missing');
assert(sourceHas('assets/app.js', "annualCost:Number(String(r.annualCost||'0')"), 'Space & Building annualCost normalization missing');
assert(parseCsv('templates/Template_Space_Building.csv')[0].map(normalizeHeader).includes(normalizeHeader('harga / m² / bulan')),'Space & Building monthly price field missing');

// Service Procurement: active importer exists and CSV is the only matching static template.
assert(sourceHas('assets/app.js', "GE_IMPORT_SCHEMA_V223['service-procurement-v243']"), 'Service Procurement importer schema missing');
assert(sourceHas('assets/app.js', 'function geImportServiceProcurementV243(rows)'), 'Service Procurement importer missing');
assert(sourceHas('branch-office-planning.html','templates/Template_Service_Procurement.csv'), 'Service Procurement CSV download missing');

// P29: dynamic CSV generator and static contract must agree; keep CSV because this contract is commercial and includes multi-period price fields.
const p29Header=headerAt(parseCsv('templates/Template_Layanan_Lounge_Tenant_P29.csv'),5);
const p29Expected=['region','station','nama layanan / provider','jenis layanan','pic','mata uang','harga per pax','tanggal mulai','tanggal berakhir','nomor dokumen','jenis dokumen','status dokumen','remarks','price period effective from','price period effective to','price period price','price period currency','price basis','price period note'].map(normalizeHeader);
assert(exactSet(p29Header,p29Expected),'P29 CSV contract header mismatch');
assert(sourceHas('assets/lounge-planning-v29.js', "a.download='Template_Layanan_Lounge_Tenant_P29.csv'"), 'P29 canonical CSV generator missing');
assert(sourceHas('assets/app.js', "GE_IMPORT_SCHEMA_V223.lounge"), 'Lounge generic importer schema missing');

// Flight: current importer accepts CSV/XLSX by header, but only a CSV template exists; do not invent XLSX in this wave.
assert(sourceHas('lounge-flights.html','templates/Template_Daftar_Penerbangan_Lounge_Tenant.csv'), 'Flight template download missing');
const flight=headerAt(parseCsv('templates/Template_Daftar_Penerbangan_Lounge_Tenant.csv'),0);
assert(exactSet(flight,['flight','from','to','tanggal','std','etd','capacity','status'].map(normalizeHeader)),'Flight template contract mismatch');
assert(sourceHas('assets/app.js', "previewFlightBulkV236(file)"), 'Flight bulk importer missing');

// Unique XLSX contracts remain intentionally retained.
for(const rel of ['Template_Data_Personil.xlsx','Template_Database_Airport.xlsx','Template_GASO_Master.xlsx','Template_GASO_Planning_Service.xlsx','Template_GASO_Service_Support.xlsx','Template_Layanan_Lounge.xlsx'])
  assert(fs.existsSync(path.join(root,'templates',rel)),`Unique XLSX contract missing: ${rel}`);

// Dynamic Initiative XLSX remains current and unique.
assert(fs.existsSync(path.join(root,'assets/Template_Bulk_Import_Initiative_V2_55.xlsx')),'Initiative XLSX runtime template missing');
assert(sourceHas('assets/v2554-stability.js','Template_Bulk_Import_Initiative_V2_55.xlsx'),'Initiative download reference missing');



// Every static HTML template download reference must resolve.
for(const html of fs.readdirSync(root).filter(x=>x.endsWith('.html'))){
  const text=read(html);
  for(const m of text.matchAll(/(?:href|src)=[\"'](templates\/[^\"'#?]+)[\"']/gi))
    assert(fs.existsSync(path.join(root,m[1])),`${html}: broken template reference ${m[1]}`);
}
console.log('P40B2_TEMPLATE_CONTRACT_PASS');
