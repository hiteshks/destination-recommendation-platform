// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe8X28sXJdd8lNLiE500GaVjC64scLf3c",
  authDomain: "destination-recommendation-app.firebaseapp.com",
  projectId: "destination-recommendation-app",
  storageBucket: "destination-recommendation-app.firebasestorage.app",
  messagingSenderId: "308629016329",
  appId: "1:308629016329:web:4b3c8e77b225a206b2cdd8",
  measurementId: "G-E86JLQ51PS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
