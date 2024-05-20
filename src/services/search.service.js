import { get, ref } from "firebase/database";
import { db } from "../config/firebase-config";

export const searchUsers = (searchQuery) => {
  return get(ref(db, "users")).then((snapshot) => {
    const users = [];
    const query = searchQuery.toLowerCase();
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (
        (user.handle && user.handle.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.firstName && user.firstName.toLowerCase().includes(query)) ||
        (user.lastName && user.lastName.toLowerCase().includes(query)) ||
        (user.phoneNumber && user.phoneNumber.includes(query))
      ) {
        users.push(user);
      }
    });
    return users;
  });
};
