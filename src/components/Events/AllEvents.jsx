import { useEffect, useState } from "react";
import { getAllEvents } from "../../services/event.service.js";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        setError("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="events-container">
      <h1>All Events</h1>
      {events.length === 0 ? (
        <div>No events found.</div>
      ) : (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p>
              Start: {event.startDate} {event.startTime}
            </p>
            <p>
              End: {event.endDate} {event.endTime}
            </p>
            <p>Public: {event.isPublic ? "Yes" : "No"}</p>
            <p>Recurring: {event.isRecurring ? "Yes" : "No"}</p>
          </div>
        ))
      )}
    </div>
  );
}
