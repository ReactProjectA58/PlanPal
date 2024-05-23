import { ref, push } from "firebase/database";
import { db } from "../config/firebase-config";

export const addEvent = async (event) => {
  const newEvent = {
    ...event,
    createdOn: Date.now(),
    isDeleted: false,
  };

  const result = await push(ref(db, "events"), newEvent);
  console.log(result.key);
  return result;
};