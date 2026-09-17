/*
 * Firebase web configuration contract.
 *
 * Do NOT place passwords, service-account keys, or private credentials here.
 * Firebase Web API configuration is client-side configuration; Firestore
 * Security Rules and Firebase Authentication enforce access.
 *
 * Before enabling Firebase-backed auth/data, populate this object from the
 * Firebase project configuration for the target environment.
 */
window.GX_FIREBASE_CONFIG = window.GX_FIREBASE_CONFIG || {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};
