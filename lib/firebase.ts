// path: lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "আপনার_API_KEY_এখানে_দিন", // স্ক্রিনশট থেকে দিন (AIzaSy...)
  authDomain: "siyamai-bd7c3.firebaseapp.com",
  projectId: "siyamai-bd7c3",
  storageBucket: "siyamai-bd7c3.firebasestorage.app",
  messagingSenderId: "542365451952",
  appId: "আপনার_APP_ID_এখানে_দিন" // স্ক্রিনশট থেকে দিন (1:542365...)
};

// Next.js এ বারবার রিলোড হলে যেন এরর না দেয় তাই এই চেকটি করা হয়
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
