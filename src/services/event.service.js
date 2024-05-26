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

export const joinEvent = async (handle, eventId) => {
  const eventRef = ref(db, `events/${eventId}`);

  try {
    const eventSnapshot = await get(eventRef);
    if (!eventSnapshot.exists()) {
      console.error('Event does not exist');
      return;
    }

    const eventTitle = eventSnapshot.val().title;

    const userEventSnapshot = await get(ref(db, `users/${handle}/goingToEvents/${eventId}`));
    if (userEventSnapshot.exists()) {
      alert("You already joined this event");
      return;
    }

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${handle}`] = true;
    updates[`users/${handle}/goingToEvents/${eventId}`] = eventTitle;

    await update(ref(db), updates);

    return { id: eventId, title: eventTitle }; 
  } catch (error) {
    console.error('Error joining event:', error);
    return null;
  }
};


export const displayMyEvents = async (userId) => {
  const userRef = ref(db, `users/${userId}/goingToEvents`);
  const snapshot = await get(userRef);
  const eventIds = snapshot.val() ? Object.keys(snapshot.val()) : [];
  
  const eventPromises = eventIds.map(async (eventId) => {
    const eventSnapshot = await get(ref(db, `events/${eventId}`));
    return eventSnapshot.val();
  });

  const events = await Promise.all(eventPromises);
  return events;
};

export const getPublicEvents = async () => {
  const db = getDatabase();
  const eventsRef = ref(db, 'events/');
  
  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      return Object.keys(eventsData)
        .filter(key => eventsData[key].isPublic)
        .map(key => ({
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

export const getPrivateEvents = async () => {
  const db = getDatabase();
  const eventsRef = ref(db, 'events/');
  
  try {
    const snapshot = await get(eventsRef);
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      return Object.keys(eventsData)
        .filter(key => !eventsData[key].isPublic)
        .map(key => ({
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