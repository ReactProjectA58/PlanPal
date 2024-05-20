import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { db } from "../config/firebase-config";
import { getDatabase } from "firebase/database";

export const getAllUsers = () => {
  return get(ref(db, "users"));
};

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const getUserData = (uid) => {
  return get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
};



export const createUserHandle = async (handle, uid, email, firstName, lastName, phone) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${handle}`);

  const userData = {
    uid,
    email,
    firstName,
    lastName,
    phone,
    handle,
    role: 'User', 
    isBlocked: false, 
  };

  console.log('User data to be set in Firebase:', userData); 

  try {
    await set(userRef, userData);
    console.log('User successfully created in Firebase');
  } catch (error) {
    console.error('Error creating user in Firebase:', error);
    throw error;
  }
};



