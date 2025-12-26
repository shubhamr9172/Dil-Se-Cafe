import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General
const firebaseConfig = {
    apiKey: "AIzaSyDqd-dtrU8YE_WtpFfXdTDZcIezaHsr9_g",
    authDomain: "cafe-pos-e09ab.firebaseapp.com",
    projectId: "cafe-pos-e09ab",
    storageBucket: "cafe-pos-e09ab.firebasestorage.app",
    messagingSenderId: "482925557210",
    appId: "1:482925557210:web:7535ca369cb0e8ddfb3ce3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
