/* Ground Experience Firebase foundation.
 * Intentionally not wired into legacy pages yet.
 */
(function(){
  'use strict';
  const state={app:null,auth:null,db:null,storage:null,ready:false,error:null};

  function configured(){
    const c=window.GX_FIREBASE_CONFIG||{};
    return !!(c.apiKey&&c.authDomain&&c.projectId&&c.appId);
  }

  async function init(){
    if(state.ready)return state;
    if(!configured()){
      state.error=new Error('Firebase configuration is not populated.');
      return state;
    }
    try{
      if(!window.firebase)throw new Error('Firebase SDK is not loaded.');
      const c=window.GX_FIREBASE_CONFIG;
      state.app=window.firebase.apps?.length?window.firebase.app():window.firebase.initializeApp(c);
      state.auth=window.firebase.auth();
      state.db=window.firebase.firestore();
      try{state.storage=window.firebase.storage()}catch(e){state.storage=null}
      state.ready=true;
    }catch(e){state.error=e}
    return state;
  }

  async function currentUser(){
    const s=await init();
    if(!s.ready||!s.auth)return null;
    return s.auth.currentUser||null;
  }

  async function signOut(){
    const s=await init();
    if(s.auth)await s.auth.signOut();
  }

  window.GXFirebase={state,configured,init,currentUser,signOut};
})();
