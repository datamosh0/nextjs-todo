import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_MESSANGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_APP_ID,
};
let app: FirebaseApp;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth: Auth = getAuth(app);
const provider: GoogleAuthProvider = new GoogleAuthProvider();
const db: Firestore = getFirestore(app);
export { auth, app, provider, db };
