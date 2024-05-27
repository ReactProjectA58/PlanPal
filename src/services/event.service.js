import { ref, push, getDatabase, get, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

export const addEvent = async (event) => {
  const newEvent = {
    ...event,
    createdOn: Date.now(),
    isDeleted: false,
    peopleGoing: {
      [event.creator]: true
    }
  };

  const result = await push(ref(db, "events"), newEvent);
  const eventId = result.key;

  const updates = {};
  updates[`users/${newEvent.creator}/goingToEvents/${newEvent.title}`] = true;

  await update(ref(db), updates);

  return { id: eventId, ...newEvent };
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

    const userEventSnapshot = await get(ref(db, `users/${handle}/goingToEvents/${eventTitle}`));
    if (userEventSnapshot.exists()) {
      alert("You already joined this event");
      return;
    }

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${handle}`] = true;
    updates[`users/${handle}/goingToEvents/${eventTitle}`] = true;

    await update(ref(db), updates);

    return { id: eventId, title: eventTitle }; 
  } catch (error) {
    console.error('Error joining event:', error);
    return null;
  }
};

export const leaveEvent = async (handle, eventTitle) => {
  const eventRef = ref(db, `events/`);
  let eventId;

  try {
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const events = snapshot.val();
      for (const id in events) {
        if (events[id].title === eventTitle) {
          eventId = id;
          break;
        }
      }
    }

    if (!eventId) {
      console.error('Event does not exist');
      return;
    }

    const updates = {};
    updates[`events/${eventId}/peopleGoing/${handle}`] = null;
    updates[`users/${handle}/goingToEvents/${eventTitle}`] = null;

    await update(ref(db), updates);

    return { id: eventId, title: eventTitle }; 
  } catch (error) {
    console.error('Error leaving event:', error);
    return null;
  }
};

export const displayMyEvents = async (userHandle) => {
  const userRef = ref(db, `users/${userHandle}/goingToEvents`);
  const snapshot = await get(userRef);
  const eventTitles = snapshot.val() ? Object.keys(snapshot.val()) : [];

  const events = [];
  for (const title of eventTitles) {
    const eventSnapshot = await get(ref(db, `events/`));
    if (eventSnapshot.exists()) {
      const allEvents = eventSnapshot.val();
      for (const id in allEvents) {
        if (allEvents[id].title === title) {
          events.push({ id, ...allEvents[id] });
          break;
        }
      }
    }
  }

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

export const getEventDetails = async (eventId) => {
  const db = getDatabase();
  const eventRef = ref(db, `events/${eventId}`);
  
  try {
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      return { id: eventId, ...snapshot.val() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};

export const getParticipants = async (eventId) => {
  const db = getDatabase();
  const participantsRef = ref(db, `events/${eventId}/peopleGoing`);
  
  try {
    const snapshot = await get(participantsRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  const db = getDatabase();
  const eventRef = ref(db, `events/${eventId}`);
  
  try {
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      return { id: eventId, ...snapshot.val() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};


export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = ref(db, `events/${eventId}`);
    await update(eventRef, eventData);
    console.log("Event updated successfully");
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};


export const deleteEvent = async (eventId) => {
  try {
    const eventRef = ref(db, `events/${eventId}`);
    await remove(eventRef);
    console.log("Event deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};