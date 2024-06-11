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
  
  export const searchUsers = async (searchTerm) => {
    const snapshot = await get(ref(db, "users"));
    if (!snapshot.exists()) return [];
  
    const users = Object.entries(snapshot.val()).map(([key, value]) => ({
      ...value,
      id: key,
    }));
  
    return users.filter(
      (user) =>
        (user.handle &&
          user.handle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.firstName &&
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName &&
              user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
};


export const blockUser = async (handle) => {
    const userRef = ref(db, `users/${handle}`);
    return update(userRef, { isBlocked: true });
};

export const unblockUser = async (handle) => {
    const userRef = ref(db, `users/${handle}`);
    return update(userRef, { isBlocked: false });
};