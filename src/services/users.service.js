import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
  update
} from "firebase/database";
import { db } from "../config/firebase-config";

export const getAllUsers = () => {
  return get(ref(db, "users"));
};

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const getUserData = (uid) => {
  return get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
};

export const createUserHandle = async (userData) => {
  try {
    await set(ref(db, `users/${userData.handle}`), userData);
    console.log("User document written with ID: ", userData.uid);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateUser = async (handle, userData) => {
  try {
    const userRef = ref(db, `users/${handle}`);
    await update(userRef, userData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

