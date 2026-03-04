// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdsQkPPtiO6vUJZu6J3xd0s5QBFEFHSXw",
  authDomain: "reference-59a44.firebaseapp.com",
  projectId: "reference-59a44",
  storageBucket: "reference-59a44.appspot.com",
  messagingSenderId: "695394205208",
  appId: "1:695394205208:web:18a8eab7de0a87f2954d6d",
  measurementId: "G-58QZ19JBJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);       // Authentification
export const db = getFirestore(app);    // Firestore
export const storage = getStorage(app); // Storage
export const analytics = getAnalytics(app); // Analytics
