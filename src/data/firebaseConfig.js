// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYV_0rRtsJM0rzkA4VUJ2npKC09sm39gk",
  authDomain: "orsealert-a36f4.firebaseapp.com",
  projectId: "orsealert-a36f4",
  storageBucket: "orsealert-a36f4.firebasestorage.app",
  messagingSenderId: "1070533688301",
  appId: "1:1070533688301:web:cae6d0c40796893df7c5e4",
  measurementId: "G-0SH9Z7CS7T"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;