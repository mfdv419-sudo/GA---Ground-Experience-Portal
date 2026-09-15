
const GX_SESSION_KEY='GXP_SESSION_V24';
const GX_SHARED_SESSION_KEY='GXP_SESSION_V24_SHARED';
const GX_RETURN_TO_KEY='GXP_RETURN_TO_V1';
const GX_DATA_KEY='GE_V2_1_DATA';

const GX_FALLBACK_USERS=[
  {id:1,name:'Super Administrator',employeeNo:'ADM001',username:'superadmin',password:'admin123',role:'Super Admin',unit:'Ground Experience',scopeType:'ALL',airports:[],loungeIds:[],tabs:['ALL'],status:'Active'},
  {id:2,name:'Portal Administrator',employeeNo:'ADM002',username:'admin',password:'admin123',role:'Admin',unit:'Ground Experience',scopeType:'ALL',airports:[],loungeIds:[],tabs:['ALL'],status:'Active'}
];

function gxGetPortalData(){
  try{return JSON.parse(localStorage.getItem(GX_DATA_KEY)||'null')}catch(e){return null}
}
function gxGetUsers(){
  const d=gxGetPortalData();
  return Array.isArray(d?.users)&&d.users.length?d.users:GX_FALLBACK_USERS;
}
function gxAuthenticate(username,password){
  return gxGetUsers().find(u =>
    String(u.username||'').toLowerCase()===String(username||'').trim().toLowerCase() &&
    String(u.password||'')===String(password||'') &&
    String(u.status||'Active')==='Active'
  )||null;
}
function gxGetSession(){
  try{
    const shared=JSON.parse(localStorage.getItem(GX_SHARED_SESSION_KEY)||'null');
    if(shared)return shared;
    const legacy=JSON.parse(sessionStorage.getItem(GX_SESSION_KEY)||'null');
    if(legacy){localStorage.setItem(GX_SHARED_SESSION_KEY,JSON.stringify(legacy));return legacy}
  }catch(e){}
  return null;
}
function gxSetSession(session){
  if(!session)return;
  const value=JSON.stringify(session);
  try{localStorage.setItem(GX_SHARED_SESSION_KEY,value)}catch(e){}
  try{sessionStorage.setItem(GX_SESSION_KEY,value)}catch(e){}
  window.GX_CURRENT_USER=session;
}
function gxCurrentRoute(){
  const page=(location.pathname.split('/').pop()||'index.html');
  return `${page}${location.search||''}${location.hash||''}`;
}
function gxSafeReturnTo(value){
  const raw=String(value||'').trim();
  if(!raw)return'';
  try{
    const url=new URL(raw,location.href);
    if(url.origin!==location.origin)return'';
    const page=(url.pathname.split('/').pop()||'index.html');
    if(!/^[a-z0-9][a-z0-9._-]*\.html$/i.test(page)||page.toLowerCase()==='login.html')return'';
    return `${page}${url.search}${url.hash}`;
  }catch(e){return''}
}
function gxRememberReturnTo(route=gxCurrentRoute()){
  const safe=gxSafeReturnTo(route);
  if(safe)try{localStorage.setItem(GX_RETURN_TO_KEY,safe)}catch(e){}
  return safe;
}
function gxConsumeReturnTo(){
  let candidate='';
  try{
    candidate=new URLSearchParams(location.search).get('next')||localStorage.getItem(GX_RETURN_TO_KEY)||'';
    localStorage.removeItem(GX_RETURN_TO_KEY);
  }catch(e){}
  return gxSafeReturnTo(candidate);
}
function gxRequireAuth(){
  if(location.pathname.endsWith('/login.html')||location.pathname.endsWith('login.html'))return;
  const s=gxGetSession();
  if(!s){
    const next=gxRememberReturnTo();
    location.replace(`login.html${next?`?next=${encodeURIComponent(next)}`:''}`);
    return;
  }
  window.GX_CURRENT_USER=s;
}

function gxAuditDirect(action,module,objectLabel,detail,userOverride=null){
  try{
    const d=JSON.parse(localStorage.getItem(GX_DATA_KEY)||'null');if(!d)return;
    d.auditLogs=Array.isArray(d.auditLogs)?d.auditLogs:[];
    const u=userOverride||gxGetSession()||{};
    d.auditLogs.unshift({
      id:Date.now()+Math.floor(Math.random()*1000),
      timestamp:new Date().toISOString(),
      username:u.username||'system',name:u.name||u.username||'System',role:u.role||'System',
      action,module,object:objectLabel||'',detail:detail||''
    });
    if(d.auditLogs.length>5000)d.auditLogs=d.auditLogs.slice(0,5000);
    localStorage.setItem(GX_DATA_KEY,JSON.stringify(d));
  }catch(e){}
}

function gxLogout(){
  const s=gxGetSession();gxAuditDirect('Logout','Authentication','Session','User logged out',s);
  try{sessionStorage.removeItem(GX_SESSION_KEY)}catch(e){}
  try{localStorage.removeItem(GX_SHARED_SESSION_KEY);localStorage.removeItem(GX_RETURN_TO_KEY)}catch(e){}
  window.GX_CURRENT_USER=null;
  location.replace('login.html');
}
function gxRoleLevel(role){
  return {'Lounge Staff':0,'Lounge Luar Biasa':0,'Staff':1,'Branch Office':1,'Viewer':1,'Admin':2,'Super Admin':3}[role]??0;
}
function gxCanManage(){
  const s=gxGetSession();return !!s&&['Admin','Super Admin'].includes(s.role);
}
function gxUserTabs(){
  const s=gxGetSession();return Array.isArray(s?.tabs)?s.tabs:[];
}
function gxHasTab(tab){
  const s=gxGetSession();if(!s)return false;
  if(s.role==='Super Admin'||s.role==='Admin'||gxUserTabs().includes('ALL'))return true;
  return gxUserTabs().includes(tab);
}
function gxAllowedAirports(){
  const s=gxGetSession();if(!s)return[];
  if(s.scopeType==='ALL'||['Admin','Super Admin'].includes(s.role))return[];
  return Array.isArray(s.airports)?s.airports:[];
}
function gxAllowedLoungeIds(){
  const s=gxGetSession();if(!s)return[];
  if(s.scopeType==='ALL'||['Admin','Super Admin'].includes(s.role))return[];
  return Array.isArray(s.loungeIds)?s.loungeIds.map(String):[];
}
function gxAirportAllowed(code){
  const allowed=gxAllowedAirports();
  return !allowed.length||allowed.includes(String(code||'').toUpperCase());
}
function gxLoungeAllowed(id,airport){
  const ids=gxAllowedLoungeIds();
  if(ids.length)return ids.includes(String(id));
  return gxAirportAllowed(airport);
}
const GX_PAGE_TAB_MAP={
 'index.html':'home','touchpoint.html':'services','standar.html':'services','map.html':'services','layanan.html':'services',
 'pre-journey.html':'initiatives','pre-flight.html':'initiatives','post-flight.html':'initiatives','post-journey.html':'initiatives','inisiatif.html':'initiatives','calendar.html':'initiatives',
 'lounge-access.html':'lounge-access','lounge-visitor.html':'lounge-visitor','lounge-list.html':'planning','lounge-purchase.html':'lounge-purchase','lounge-flights.html':'lounge-flights',
 'service-planning.html':'planning','station-material.html':'planning','branch-office-planning.html':'planning','gaso-planning.html':'planning','lounge-procurement.html':'planning','bo-space.html':'planning','airport-systems.html':'planning','planning-documents.html':'planning',
 'data.html':'data','berita.html':'news','kontak.html':'contact','admin.html':'admin'
};
function gxDefaultPage(){
  const s=gxGetSession();if(!s)return'login.html';
  if(['Lounge Staff','Lounge Luar Biasa'].includes(s.role))return'lounge-access.html';
  if(gxHasTab('home'))return'index.html';
  const first=gxUserTabs()[0];
  return ({
    services:'touchpoint.html',initiatives:'pre-flight.html',planning:'service-planning.html','lounge-access':'lounge-access.html',
    'lounge-visitor':'lounge-visitor.html','lounge-list':'lounge-list.html','lounge-flights':'lounge-flights.html',data:'data.html',news:'berita.html',contact:'kontak.html'
  })[first]||'index.html';
}
function gxEnforcePageAccess(){
  const page=(location.pathname.split('/').pop()||'index.html');
  if(page==='login.html'||page==='service.html')return;
  if(page==='lounge-list.html'&&(gxHasTab('planning')||gxHasTab('lounge-list')))return;
  const tab=GX_PAGE_TAB_MAP[page];
  if(tab&&!gxHasTab(tab)){location.replace(gxDefaultPage())}
}
function gxApplyRole(){
  const s=gxGetSession();if(!s)return;
  document.querySelectorAll('[data-role-min]').forEach(el=>{
    if(gxRoleLevel(s.role)<gxRoleLevel(el.dataset.roleMin))el.style.display='none';
  });
  document.querySelectorAll('[data-admin-only]').forEach(el=>{if(!gxCanManage())el.style.display='none'});
}
function gxApplyNavigation(){
  const map={
    'index.html':'home','touchpoint.html':'services','standar.html':'services','map.html':'services',
    'pre-journey.html':'initiatives','pre-flight.html':'initiatives','post-flight.html':'initiatives','post-journey.html':'initiatives',
    'lounge-access.html':'lounge-access','lounge-visitor.html':'lounge-visitor','lounge-list.html':'planning','lounge-purchase.html':'lounge-purchase','lounge-flights.html':'lounge-flights',
    'service-planning.html':'planning','station-material.html':'planning','branch-office-planning.html':'planning','gaso-planning.html':'planning','lounge-procurement.html':'planning','bo-space.html':'planning','airport-systems.html':'planning','planning-documents.html':'planning',
    'data.html':'data','berita.html':'news','kontak.html':'contact','admin.html':'admin'
  };
  document.querySelectorAll('.side a[href]').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('?')[0];
    const tab=map[href];
    if(tab&&!gxHasTab(tab))a.style.display='none';
  });
  // Hide empty navigation groups.
  [['serviceNav','services'],['initiativeNav','initiatives'],['planningNav','planning']].forEach(([id,tab])=>{
    const g=document.getElementById(id);if(!g)return;
    if(tab&&!gxHasTab(tab)){g.style.display='none';return}
  });
}
gxRequireAuth();
if(!location.pathname.endsWith('login.html'))gxEnforcePageAccess();
