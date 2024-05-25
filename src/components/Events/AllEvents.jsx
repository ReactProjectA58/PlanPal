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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">All Events</h1>
      <a href="/create-event" className="absolute top-0 left-0 mt-4 ml-4 z-10">
        <button className="btn btn-primary">Create Event</button>
      </a>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mt-12">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="card w-full sm:w-96 bg-base-100 shadow-xl transform transition-transform hover:scale-105 mt-8"
            >
              <figure className="px-10 pt-10">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Event"
                  className="rounded-xl"
                />
              </figure>
              <div className="card-body items-center text-center space-y-2">
                <h2 className="card-title text-2xl font-semibold">{event.title}</h2>
                <p className="text-gray-700 break-words whitespace-normal overflow-hidden max-h-24">
                  {event.description}
                </p>
                <p className="text-gray-500">Location: {event.location}</p>
                <p className="text-gray-500">
                  Start: {event.startDate} {event.startTime}
                </p>
                <p className="text-gray-500">
                  End: {event.endDate} {event.endTime}
                </p>
                <p className="text-gray-500">Public: {event.isPublic ? "Yes" : "No"}</p>
                <p className="text-gray-500">Reoccurring: {event.isReoccurring}</p>
                <div className="card-actions mt-4">
                  <button className="btn btn-primary">View more</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
