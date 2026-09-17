/* Ground Experience Firebase client.
 * Uses the existing Firebase project. No database reset, seed, or destructive migration.
 * Firebase compat SDK is loaded lazily from Google's CDN so legacy static pages remain compatible.
 */
(function(){
  'use strict';
  const state={app:null,auth:null,db:null,storage:null,ready:false,error:null,promise:null};
  const SDK='https://www.gstatic.com/firebasejs/10.14.1/firebase-';

  function configured(){const c=window.GX_FIREBASE_CONFIG||{};return !!(c.apiKey&&c.authDomain&&c.projectId&&c.appId)}
  function load(src){return new Promise((resolve,reject)=>{if(document.querySelector('script[src="'+src+'"]')){resolve();return}const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('Failed to load Firebase SDK'));document.head.appendChild(s)})}
  async function sdk(){
    if(window.firebase&&window.firebase.initializeApp)return;
    await load(SDK+'app-compat.js');
    await load(SDK+'auth-compat.js');
    await load(SDK+'firestore-compat.js');
    try{await load(SDK+'storage-compat.js')}catch(e){}
  }
  async function init(){
    if(state.ready)return state;
    if(state.promise)return state.promise;
    state.promise=(async()=>{
      if(!configured()){state.error=new Error('Firebase configuration is not populated.');return state}
      try{
        await sdk();
        const c=window.GX_FIREBASE_CONFIG;
        state.app=window.firebase.apps&&window.firebase.apps.length?window.firebase.app():window.firebase.initializeApp(c);
        state.auth=window.firebase.auth();
        state.db=window.firebase.firestore();
        try{state.storage=window.firebase.storage()}catch(e){state.storage=null}
        state.ready=true;
      }catch(e){state.error=e}
      return state;
    })();
    return state.promise;
  }
  async function currentUser(){const s=await init();return s.ready&&s.auth?s.auth.currentUser:null}
  async function profile(uid){const s=await init();if(!s.ready||!s.db||!uid)return null;const snap=await s.db.collection('users').doc(String(uid)).get();return snap.exists?{id:snap.id,...snap.data()}:null}
  function normalizeUser(p,authUser){
    if(!p&& !authUser)return null;
    p=p||{};
    return {...p,uid:p.uid||authUser?.uid||p.id||'',id:p.id||p.uid||authUser?.uid||'',email:p.email||authUser?.email||'',name:p.name||authUser?.displayName||p.username||'',username:p.username||authUser?.email||'',status:p.status||'Active',tabs:Array.isArray(p.tabs)?p.tabs:[],permissions:Array.isArray(p.permissions)?p.permissions:[]};
  }
  async function currentProfile(){const u=await currentUser();return u?normalizeUser(await profile(u.uid),u):null}
  async function signInWithEmail(email,password){const s=await init();if(!s.ready)throw s.error||new Error('Firebase unavailable');const c=await s.auth.signInWithEmailAndPassword(String(email).trim(),String(password));const p=normalizeUser(await profile(c.user.uid),c.user);if(p&&String(p.status||'Active').toLowerCase()!=='active'){await s.auth.signOut();throw new Error('ACCOUNT_INACTIVE')}return p}
  async function signInWithUsername(username,password){
    const s=await init();if(!s.ready)throw s.error||new Error('Firebase unavailable');
    const value=String(username||'').trim();
    if(value.includes('@'))return signInWithEmail(value,password);
    const snap=await s.db.collection('users').where('username','==',value).limit(1).get();
    if(snap.empty)throw new Error('INVALID_CREDENTIALS');
    const p=snap.docs[0].data();
    if(!p.email)throw new Error('USER_EMAIL_MISSING');
    return signInWithEmail(p.email,password);
  }
  async function signOut(){const s=await init();if(s.auth)await s.auth.signOut()}
  async function initiativesFor(uid){
    const s=await init();if(!s.ready||!s.db||!uid)return[];
    const col=s.db.collection('initiatives');
    const [shared,mentioned]=await Promise.all([
      col.where('sharedWithUserIds','array-contains',String(uid)).get(),
      col.where('mentionedUserIds','array-contains',String(uid)).get()
    ]);
    const map=new Map();[...shared.docs,...mentioned.docs].forEach(d=>map.set(d.id,{id:d.id,...d.data()}));
    return [...map.values()];
  }
  async function accessibleInitiatives(user){
    const u=user||await currentProfile();if(!u)return[];
    const role=String(u.role||'').toLowerCase();
    const external=['external user','external','collaborator'].includes(role);
    if(external)return initiativesFor(u.uid);
    const s=await init();if(!s.ready||!s.db)return[];
    const snap=await s.db.collection('initiatives').get();
    return snap.docs.map(d=>({id:d.id,...d.data()}));
  }
  async function updateInitiativeSharing(initiativeId,patch){
    const s=await init();if(!s.ready||!s.db)throw new Error('Firebase unavailable');
    const allowed={};['visibility','sharedWithUserIds','mentionedUserIds'].forEach(k=>{if(Object.prototype.hasOwnProperty.call(patch||{},k))allowed[k]=Array.isArray(patch[k])?patch[k].map(String):patch[k]});
    allowed.updatedAt=window.firebase.firestore.FieldValue.serverTimestamp();
    await s.db.collection('initiatives').doc(String(initiativeId)).set(allowed,{merge:true});
    return allowed;
  }
  async function notifyMention({actorId,actorName,recipientId,initiativeId,initiativeName,message}){
    const s=await init();if(!s.ready||!s.db)throw new Error('Firebase unavailable');
    const ref=s.db.collection('inbox').doc();
    await ref.set({type:'INITIATIVE_MENTION',actorId:String(actorId||''),actorName:String(actorName||''),recipientId:String(recipientId||''),initiativeId:String(initiativeId||''),initiativeName:String(initiativeName||''),subject:'Mention pada initiative',message:String(message||''),createdAt:window.firebase.firestore.FieldValue.serverTimestamp(),read:false,status:'UNREAD'});
    return ref.id;
  }
  window.GXFirebase={state,configured,init,currentUser,currentProfile,profile,signInWithEmail,signInWithUsername,signOut,initiativesFor,accessibleInitiatives,updateInitiativeSharing,notifyMention};
})();