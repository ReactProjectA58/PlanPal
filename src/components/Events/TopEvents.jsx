import { useEffect, useState } from "react";
import { getTopThreeEvents } from "../../services/event.service.js";
import EventItem from "./EventItem.jsx";

const TopThreeEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopThreeEvents = async () => {
      try {
        const topThreeEvents = await getTopThreeEvents();
        setEvents(topThreeEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopThreeEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="events-container relative px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Hot Events</h1>
      </div>
      <ul>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </ul>
    </div>
  );
};

export default TopThreeEvents;
