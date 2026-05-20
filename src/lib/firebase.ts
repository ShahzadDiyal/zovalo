import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCllsMAeEfwf5KDNHsECrUZrcD5YfDdVgE",
  authDomain: "zovallo.firebaseapp.com",
  projectId: "zovallo",
  storageBucket: "zovallo.firebasestorage.app",
  messagingSenderId: "16353576871",
  appId: "1:16353576871:web:e6a59b5e610573789f5882",
  measurementId: "G-95YTHK46EX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics lazily (to avoid issues in development)
export const analytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null,
);
