import { ref, push, getDatabase, get, update } from "firebase/database";
import { db } from "../config/firebase-config";

export const addEvent = async (event) => {
  const newEvent = {
    ...event,
    createdOn: Date.now(),
    isDeleted: false,
  };

  const result = await push(ref(db, "events"), newEvent);
  return result;
};

export const getAllEvents = async () => {
  const db = getDatabase();
  const eventsRef = ref(db, 'events/');
  
  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      return Object.keys(eventsData).map(key => ({
        id: key,
        ...eventsData[key]
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};
