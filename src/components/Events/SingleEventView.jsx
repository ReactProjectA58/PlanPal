import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import {
  getEventById,
  joinEvent,
  leaveEvent,
} from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { GoBackArrow, Edit } from "../../common/helpers/icons.jsx";
import { EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";
import Map from "./Map.jsx";
import "./styles.css";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";
import { themeChecker } from "../../common/helpers/toast.js";
import showConfirmDialog from "../ConfirmDialog.jsx";

export default function SingleEventView() {
  const { eventId } = useParams();
  const { setAppState } = useContext(AppContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const participantsRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        setError("Failed to fetch event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        participantsRef.current &&
        !participantsRef.current.contains(event.target)
      ) {
        participantsRef.current.removeAttribute("open");
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [participantsRef]);

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

  const handleLeaveEvent = async (eventId, eventTitle) => {
    showConfirmDialog("Do you want to leave this event?", async () => {
      const result = await leaveEvent(userData.handle, eventId);
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

  if (loading)
    return (
      <div className="text-center mt-10">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!event) return <div className="text-center mt-10">No event found.</div>;

  return (
    <div className="single-event-container p-4 max-w-5xl mx-auto rounded-lg mt-8 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <div className="flex items-center space-x-2">
          <GoBackArrow onClick={() => navigate("/events")} />
          {(userData?.handle === event.creator ||
            userData?.role === "Admin") && (
            <Edit onClick={() => navigate(`/update-event/${eventId}`)} />
          )}
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Creator:</span> {event.creator}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Start Time:</span> {event.startDate}{" "}
        {event.startTime}
      </div>
      <div className="mb-4">
        <span className="font-semibold">End Time:</span> {event.endDate}{" "}
        {event.endTime}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Address:</span> {event.location}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Category:</span> {event.category}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Description:</span> {event.description}
      </div>
      <div className="mb-4 flex">
        <div className="mr-2 flex justify-start ">
          <img
            src={event.cover || EVENT_COVER_BY_DEFAULT}
            alt="Event"
            className="rounded-xl max-w-xl h-96 object-contain  "
          />
        </div>
        <div className="flex-grow ml-2">
          <Map address={event.location} className="w-full h-96" />
        </div>
      </div>
      <div className="mb-4 relative" ref={participantsRef}>
        <details className="dropdown">
          <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
            Participants
          </summary>
          <div
            className="dropdown-menu absolute max-h-48 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black "
            style={{ zIndex: 999 }}
          >
            <ul className="space-y-2 overflow-x-hidden ">
              {event.peopleGoing ? (
                Object.entries(event.peopleGoing).map(
                  ([participant, participantData], index) => (
                    <li
                      key={participant}
                      className={`flex items-center space-x-3 hover:glass ${
                        index % 3 === 0 && "mt-4"
                      }`}
                    >
                      <img
                        src={
                          participantData.avatar ||
                          "https://via.placeholder.com/40"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">
                          {participantData.name || participant}
                        </div>
                        <div className="text-sm">@{participant}</div>
                      </div>
                    </li>
                  )
                )
              ) : (
                <li>No participants yet.</li>
              )}
            </ul>
          </div>
        </details>
        {userData.goingToEvents && userData.goingToEvents[event.title] ? (
          <button className="btn" onClick={() => handleLeaveEvent(event.title)}>
            Leave Event
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => handleJoinEvent(event.id, event.title)}
          >
            Join Event
          </button>
        )}
      </div>
    </div>
  );
}
