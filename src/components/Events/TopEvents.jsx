import React, { useContext, useEffect, useState } from "react";
import {
  getTopThreeEvents,
  joinEvent,
  leaveEvent,
} from "../../services/event.service.js";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";

const TopThreeEvents = () => {
  const { user, userData, setAppState } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleJoinEventDashboard = async (eventId, eventTitle) => {
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
      navigate("/");
    }
  };

  const handleLeaveEventDashboard = async (eventTitle) => {
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
      navigate("/");
    }
  };

  return (
    <div className="events-container relative px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Hot Events</h1>
      </div>
      <ul>
        {events.map((event) => (
          <li
            key={event.id}
            className="event-card shadow-xl transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg "
          >
            <figure className="w-96 h-64">
              <img
                src={event.cover || EVENT_COVER_BY_DEFAULT}
                alt="Event"
                className="event-cover rounded-xl w-full h-full object-cover "
              />
            </figure>
            <div className="card-body w-2/3 flex flex-col space-y-2 ">
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
                {user ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View more
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/login/`)}
                  >
                    View more
                  </button>
                )}

                {userData?.goingToEvents &&
                userData?.goingToEvents[event.title] ? (
                  <button
                    className="btn"
                    onClick={() => handleLeaveEventDashboard(event.title)}
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      handleJoinEventDashboard(event.id, event.title)
                    }
                  >
                    Join Event
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopThreeEvents;
