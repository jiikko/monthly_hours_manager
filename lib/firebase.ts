import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "jiikko.firebaseapp.com",
  projectId: "jiikko",
  storageBucket: "jiikko.appspot.com",
  messagingSenderId: "1009399482983",
  appId: "1:1009399482983:web:a0cb481abe2971776ce2c2",
  measurementId: "G-BC2S4M9LR7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
