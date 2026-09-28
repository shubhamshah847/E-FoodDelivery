// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API,
  authDomain: "food-delivery-5f779.firebaseapp.com",
  projectId: "food-delivery-5f779",
  storageBucket: "food-delivery-5f779.firebasestorage.app",
  messagingSenderId: "897782207763",
  appId: "1:897782207763:web:e2f7b28430921b372eb6e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()