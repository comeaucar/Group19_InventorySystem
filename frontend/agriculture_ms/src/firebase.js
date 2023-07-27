// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5d7-EGWUCLKYdZy0G7NVZ94IR-QTrPb4",
  authDomain: "g19-project.firebaseapp.com",
  projectId: "g19-project",
  storageBucket: "g19-project.appspot.com",
  messagingSenderId: "181191707278",
  appId: "1:181191707278:web:387db4a3e68abf457917df",
  measurementId: "G-13VM7Z4DQ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app };
export { auth };
export { db };