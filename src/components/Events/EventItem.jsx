/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { joinEvent, leaveEvent } from "../../services/event.service.js";
import { EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";

const EventItem = ({ event }) => {
  const { user, userData } = useContext(AppContext);
  const [isGoing, setIsGoing] = useState(userData?.goingToEvents?.[event.title] || false);
  const navigate = useNavigate();

  const handleJoinEventDashboard = async () => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }

    const result = await joinEvent(userData.handle, event.id);
    if (result) {
      alert("You have joined the event successfully!");

      setIsGoing(true);
    }
  };

  const handleLeaveEventDashboard = async () => {
    if (!userData) {
      alert("User data is not available.");
      return;
    }

    const result = await leaveEvent(userData.handle, event.title);
    if (result) {
      alert("You have left the event successfully!");

      setIsGoing(false);
    }
  };

  return (
    <li className="event-card shadow-xl transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg ">
      <figure className="w-96 h-64">
        <img
          src={event.cover || EVENT_COVER_BY_DEFAULT}
          alt="Event"
          className="event-cover rounded-xl w-full h-full object-cover "
        />
      </figure>
      <div className="card-body w-2/3 flex flex-col space-y-2 ">
        <h2 className="card-title text-xl font-semibold">{event.title}</h2>
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
            onClick={() =>
              user ? navigate(`/events/${event.id}`) : navigate(`/login`)
            }
          >
            View more
          </button>
          {user && (
            <>
              {isGoing ? (
                <button className="btn" onClick={handleLeaveEventDashboard}>
                  Leave Event
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={handleJoinEventDashboard}>
                  Join Event
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default EventItem;

