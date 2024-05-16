import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDgtfrE7KY3wCFVwQ2bz0pVqpG_pELY2Gk",
  authDomain: "planpal-65592.firebaseapp.com",
  databaseURL:
    "https://planpal-65592-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "planpal-65592",
  storageBucket: "planpal-65592.appspot.com",
  messagingSenderId: "703107405045",
  appId: "1:703107405045:web:8cced77b583a037f77e1bc",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
