import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Yapılandırma tek yerden gelir (bkz. firebaseConfig.js): sunucu tarafı
// okuma katmanı da aynı anahtarı kullanıyor.
import { FIREBASE_API_KEY, FIREBASE_PROJECT_ID } from "./firebaseConfig";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "genco-platform.firebaseapp.com",
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: "genco-platform.firebasestorage.app",
  messagingSenderId: "603983528447",
  appId: "1:603983528447:web:3ade95c0a15dd6125ea7ca"
};

// Next.js için güvenli Firebase başlatma
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);