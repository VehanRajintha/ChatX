import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZBy7zFUAetKKf2hzlaMKp4FXNGd8H1yg",
  authDomain: "chatx-c93e0.firebaseapp.com",
  projectId: "chatx-c93e0",
  storageBucket: "chatx-c93e0.firebasestorage.app",
  messagingSenderId: "632475885672",
  appId: "1:632475885672:web:184b0b5d4937bc432a9bdd",
  measurementId: "G-84R7PJ32VB"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app; 