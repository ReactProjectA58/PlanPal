import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOv6te6B7Wiq0aRciZfgBPBwN-y9XUa4g",
  authDomain: "planpal-final.firebaseapp.com",
  databaseURL: "https://planpal-final-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "planpal-final",
  storageBucket: "planpal-final.appspot.com",
  messagingSenderId: "513816265162",
  appId: "1:513816265162:web:78adcec825ee0fc8784f33",
  measurementId: "G-D1Z9RGRJ8E"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);