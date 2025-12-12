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
  apiKey: "AIzaSyDh3ZuihshIu1o0XZySbZD_ud8iB5RN-dA",
  authDomain: "boggle-f4015.firebaseapp.com",
  projectId: "boggle-f4015",
  storageBucket: "boggle-f4015.firebasestorage.app",
  messagingSenderId: "773529836780",
  appId: "1:773529836780:web:6ebaf691021bef3c89d9c9",
  measurementId: "G-3MB7Z693RH"
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
