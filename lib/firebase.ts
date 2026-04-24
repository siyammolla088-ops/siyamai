// path: lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs-G5uK9hGv-S-qO_e8vXpM7_v6eG-W8", // আপনার স্ক্রিনশট থেকে নিলাম
  authDomain: "siyamai-bd7c3.firebaseapp.com",
  projectId: "siyamai-bd7c3",
  storageBucket: "siyamai-bd7c3.firebasestorage.app",
  messagingSenderId: "542365451952",
  appId: "1:542365451952:web:644a30349635b719069d6b" // আপনার স্ক্রিনশট থেকে নিলাম
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
