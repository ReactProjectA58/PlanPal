import { useEffect, useState, useContext } from "react";
import {
  getAllEvents,
  joinEvent,
  leaveEvent,
} from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    userData,
    loading: userLoading,
    setAppState,
  } = useContext(AppContext);
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
          [eventTitle]: true,
        },
      };
      setAppState(updatedUserData);
      navigate("/my-events");
    }
  };

  const handleLeaveEvent = async (eventTitle) => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }

    const result = await leaveEvent(userData.handle, eventTitle);
    if (result) {
      window.confirm("Please confirm you want to leave this event!");

      const updatedUserData = {
        ...userData,
        goingToEvents: {
          ...userData.goingToEvents,
          [eventTitle]: false,
        },
      };
      setAppState(updatedUserData);
      navigate("/my-events");
    }
  };

  if (loading || userLoading || !userData)
    return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        All Events
      </h1>
      <div className="absolute top-0 left-0 mt-4 ml-4 z-10 flex space-x-4">
        <a href="/create-event">
          <button className="btn btn-primary">Create Event</button>
        </a>
        <a href="/my-events">
          <button className="btn btn-secondary">My Events</button>
        </a>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/public-events")}
        >
          Public Events
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/private-events")}
        >
          Private Events
        </button>
      </div>
      <div className="flex flex-col space-y-6 mt-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="event-card shadow-xl transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg"
            >
              <figure className="w-96 h-64">
                <img
                  src={event.cover || EVENT_COVER_BY_DEFAULT}
                  alt="Event"
                  className="event-cover rounded-xl w-full h-full object-cover"
                />
              </figure>
              <div className="card-body w-2/3 flex flex-col space-y-2">
                <h2 className="card-title text-xl font-semibold">
                  {event.title}
                </h2>
                <p className="text-gray-700 break-words whitespace-normal overflow-hidden max-h-24 text-sm">
                  {event.description}
                </p>
                <div className="grid grid-cols-3 gap-4 text-gray-500 text-xs">
                  <p className="col-span-3">Location: {event.location}</p>
                  <p>
                    Start: {event.startDate} {event.startTime}
                  </p>
                  <p>
                    End: {event.endDate} {event.endTime}
                  </p>
                  <p>Public: {event.isPublic ? "Yes" : "No"}</p>
                  <p>Reoccurring: {event.isReoccurring}</p>
                  <p>Creator: {event.creator}</p>
                  <p>Category: {event.category}</p>
                </div>
                <div className="card-actions flex space-x-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View more
                  </button>
                  {userData.goingToEvents &&
                  userData.goingToEvents[event.title] ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleLeaveEvent(event.title)}
                    >
                      Leave Event
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleJoinEvent(event.id, event.title)}
                    >
                      Join Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
