// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Make sure to replace placeholders
const firebaseConfig = {
  apiKey: "API",
  authDomain: "DOMAIN",
  projectId: "ID",
  storageBucket: "APP",
  messagingSenderId: "ID",
  appId: "ID",
  measurementId: "ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Force user to select account if they have multiple
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
