import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
  update,
  getDatabase,
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
    const userHandle = userData.handle.toLowerCase();
    userData.handle = userHandle;
    await set(ref(db, `users/${userHandle}`), userData);
    console.log("User document written with ID: ", userData.uid);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateUser = async (handle, userData) => {
  try {
    const userHandle = handle.toLowerCase();
    const userRef = ref(db, `users/${userHandle}`);
    await update(userRef, userData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUserContacts = async (handle) => {
  const userHandle = handle.toLowerCase();
  const userRef = ref(db, `users/${userHandle}/contacts`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const getUserAvatar = async (handle) => {
  const userHandle = handle.toLowerCase();
  const userRef = ref(getDatabase(), `users/${userHandle}/avatar`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return "https://via.placeholder.com/40";
    }
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return "https://via.placeholder.com/40"; 
  }
};