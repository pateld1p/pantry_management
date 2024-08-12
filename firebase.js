// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "inventory-management-fc151.firebaseapp.com",
  projectId: "inventory-management-fc151",
  storageBucket: "inventory-management-fc151.appspot.com",
  messagingSenderId: "1029680313164",
  appId: "1:1029680313164:web:34718d413f6781641ad5e9",
  measurementId: "G-0K2KCV1920"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}