import { useEffect, useState, useContext } from "react";
import { getAllEvents, joinEvent } from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData, loading: userLoading, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

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

  const handleJoinEvent = async (eventId, eventTitle) => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }

    const result = await joinEvent(userData.handle, eventId);
    if (result) {
      alert("You have joined the event successfully!");

      const updatedUserData = {
        ...userData,
        goingToEvents: {
          ...userData.goingToEvents,
          [eventTitle]: true
        }
      };
      setAppState(updatedUserData);
      navigate("/my-events");
    }
  };

  if (loading || userLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">All Events</h1>
      <div className="absolute top-0 left-0 mt-4 ml-4 z-10 flex space-x-4">
        <a href="/create-event">
          <button className="btn btn-primary">Create Event</button>
        </a>
        <a href="/my-events">
          <button className="btn btn-secondary">My Events</button>
        </a>
        <button className="btn btn-secondary" onClick={() => navigate('/public-events')}>
          Public Events
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/private-events')}>
          Private Events
        </button>
      </div>
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
                <p className="text-gray-500">Creator: {event.creator}</p>
                <div className="card-actions mt-4 flex space-x-2">
                  <button className="btn btn-primary">View more</button>
                  <button className="btn btn-secondary" onClick={() => handleJoinEvent(event.id, event.title)}>
                    Join Event
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
