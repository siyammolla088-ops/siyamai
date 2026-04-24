import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AlzaSyAhc5CCT8CsNCcaKhiBQ7IoAlOuUKtSibI", // আপনার অরিজিনাল কী
  authDomain: "siyamai-5a94c.firebaseapp.com", //
  projectId: "siyamai-5a94c", //
  storageBucket: "siyamai-5a94c.firebasestorage.app", //
  messagingSenderId: "941063493380", //
  appId: "1:941063493380:web:6fccb30bb84e385abb2251", //
  measurementId: "G-30EHVDHGLT" //
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
