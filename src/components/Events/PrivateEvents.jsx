import { useEffect, useState, useContext } from "react";
import {
  getPrivateEvents,
  joinEvent,
  leaveEvent,
} from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { GoBackArrow } from "../../common/helpers/icons.jsx";
import { EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";
import { errorChecker, themeChecker } from "../../common/helpers/toast.js";
import showConfirmDialog from "../ConfirmDialog.jsx";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";

export default function PrivateEvents() {
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
        const privateEvents = await getPrivateEvents();
        setEvents(privateEvents);
      } catch (error) {
        setError("Failed to fetch private events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleJoinEvent = async (eventId, eventTitle) => {
    if (!userData) {
      errorChecker("User data is not available.");
      return;
    }

    const result = await joinEvent(userData.handle, eventId);
    if (result) {
      themeChecker("You have joined the event successfully!");

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
    showConfirmDialog("Do you want to leave this event?", async () => {
      const result = await leaveEvent(userData.handle, eventTitle);
      if (result) {
        themeChecker("You have left the event successfully!");
        const updatedGoingToEvents = { ...userData.goingToEvents };
        updatedGoingToEvents[eventTitle] = false;
        setAppState({
          ...userData,
          goingToEvents: updatedGoingToEvents,
        });
        navigate("/my-events");
      }
    });
  };

  if (loading || userLoading)
    return (
      <div className="text-center mt-10">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 ">Private Events</h1>
      <div className="absolute top-0 right-0 mt-4 mr-4 z-10">
        <GoBackArrow onClick={() => navigate("/events")} />
      </div>
      <div className="flex flex-col space-y-6 mt-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">
            No private events found.
          </div>
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
                <p className="text-gray-500 break-words whitespace-normal overflow-hidden max-h-24 text-sm">
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
                      className="btn"
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
