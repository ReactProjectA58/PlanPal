import {
  equalTo,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  update,
} from "firebase/database";
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

export const deleteContactList = (listId) => {
  const updates = {};
  updates[`contactLists/${listId}`] = null;

  return update(ref(db), updates);
};

export const contactListsListener = (user, callBack) => {
  const handle = user.toLowerCase();
  const queryRef = query(
    ref(db, "contactLists"),
    orderByChild("creator"),
    equalTo(handle)
  );

  return onValue(queryRef, (snapshot) => {
    const data = snapshot.val() ? Object.values(snapshot.val()) : [];
    callBack(data);
  });
};
