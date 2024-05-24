import { push, ref, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const createContactList = (title, user) => {
  const creator = user.toLowerCase();
  push(ref(db, "contactLists"), {
    title,
    creator,
  })
    .then((list) => {
      const contactListKey = list.key;
      const updates = {};
      updates[`users/${creator}/contactLists/${contactListKey}`] = true;
      updates[`contactLists/${contactListKey}/key/`] = contactListKey;
      return update(ref(db), updates);
    })
    .catch((error) => {
      console.error("Error creating list", error);
    });
};
