import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
  update,
} from "firebase/database";
import { db } from "../config/firebase-config";

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const getUserData = (uid) => {
  return get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
};

export const createUserHandle = (
  handle,
  firstName,
  lastName,
  email,
  userName,
  phoneNumber,
  uid
) => {
  return set(ref(db, `users/${handle}`), {
    firstName,
    lastName,
    email,
    userName,
    phoneNumber,
    uid,
    createdOn: Date.now(),
  });
};
