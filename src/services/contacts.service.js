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

export const createContactList = async (title, user) => {
  try {
    const creator = user.toLowerCase();
    const list = await push(ref(db, "contactLists"), { title, creator });
    const contactListKey = list.key;
    const updates = {
      [`users/${creator}/contactLists/${contactListKey}`]: true,
      [`contactLists/${contactListKey}/key/`]: contactListKey,
    };
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error creating list", error);
  }
};

export const deleteContactList = async (listId, user) => {
  const creator = user.toLowerCase();
  const updates = {
    [`contactLists/${listId}`]: null,
    [`users/${creator}/contactLists/${listId}`]: null,
  };

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error deleting contact list", error);
  }
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

export const addContact = async (handle, contactName) => {
  const user = handle.toLowerCase();
  const contact = contactName.toLowerCase();
  const updates = {
    [`users/${user}/contacts/${contact}`]: true,
  };

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error adding contact", error);
  }
};

export const removeContact = async (handle, contactName) => {
  const user = handle.toLowerCase();
  const contact = contactName.toLowerCase();
  const updates = {
    [`users/${user}/contacts/${contact}`]: null,
  };

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error removing contact", error);
  }
};

export const updateContact = async (contactListKey, updatedContacts) => {
  const updates = {
    [`contactLists/${contactListKey}/contacts`]: updatedContacts,
  };

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error updating contact", error);
  }
};
