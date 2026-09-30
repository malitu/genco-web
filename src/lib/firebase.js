import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnAih19--l7BLzm8mHQSyKQetIZJiSX1M",
  authDomain: "genco-platform.firebaseapp.com",
  projectId: "genco-platform",
  storageBucket: "genco-platform.firebasestorage.app",
  messagingSenderId: "603983528447",
  appId: "1:603983528447:web:3ade95c0a15dd6125ea7ca"
};

// Next.js için güvenli Firebase başlatma
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);