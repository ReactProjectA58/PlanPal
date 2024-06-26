import { useEffect, useState, useContext, useRef } from "react";
import {
  getAllEvents,
  joinEvent,
  leaveEvent,
  sortByCategory,
  searchEventsByName,
} from "../../services/event.service.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { BASE, EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";
import "./styles.css";
import { errorChecker, themeChecker } from "../../common/helpers/toast.js";
import LoadingSpinner from "../Loading/LoadingSpinner.jsx";
import showConfirmDialog from "../ConfirmDialog.jsx";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    userData,
    loading: userLoading,
    setAppState,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  const categories = ["Entertainment", "Sports", "Culture & Science", "Other"];

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userData) return;
      try {
        const eventsData = await getAllEvents(userData.handle);
        setEvents(eventsData);
      } catch (error) {
        setError("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userData]);

  useEffect(() => {
    const performSearch = async () => {
      if (!userData) return;
      if (searchTerm.trim() !== "") {
        const results = await searchEventsByName(searchTerm);
        setEvents(results);
      } else {
        const eventsData = await getAllEvents(userData.handle);
        setEvents(eventsData);
      }
    };

    performSearch();
  }, [searchTerm, userData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        categoriesRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      navigate(`${BASE}my-events`);
    }
  };

  const handleLeaveEvent = async (eventTitle) => {
    if (!userData) {
      errorChecker("User data is not available.");
      return;
    }

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
        navigate(`${BASE}my-events`);
      }
    });
  };

  const handleSortByCategory = async (category) => {
    setLoading(true);
    try {
      const sortedEvents = await sortByCategory(category);
      setEvents(sortedEvents);
    } catch (error) {
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
    if (categoriesRef.current) {
      categoriesRef.current.removeAttribute("open");
    }
  };

  if (loading || userLoading || !userData)
    return (
      <div className="text-center mt-10">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="events-container relative px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">All Events</h1>
      </div>
      <div className="flex justify-between mb-8">
        <div className="flex space-x-4">
          <button onClick={() => navigate(`${BASE}create-event`)}>
            <button className="btn btn-primary">Create Event</button>
          </button>

          <button onClick={() => navigate(`${BASE}my-events`)}>
            <button className="btn">My Events</button>
          </button>

          <button
            className="btn"
            onClick={() => navigate(`${BASE}public-events`)}
          >
            Public Events
          </button>
          <button
            className="btn"
            onClick={() => navigate(`${BASE}private-events`)}
          >
            Private Events
          </button>
        </div>
        <div className="flex space-x-4 items-center">
          {userData.role === "Admin" && (
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                placeholder="Search events"
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <details
            className="dropdown"
            ref={categoriesRef}
            style={{ position: "relative" }}
          >
            <summary className="font-bold py-2 px-4 cursor-pointer btn btn-secondary">
              ▼Categories
            </summary>
            <div
              className="dropdown-menu absolute max-h-48 overflow-y-auto mt-2"
              style={{ zIndex: 999 }}
            >
              <ul className="space-y-2 backdrop-blur-lg bg-white/10 text-black">
                {categories.length === 0 ? (
                  <li className="p-2 hover:glass">No categories found.</li>
                ) : (
                  categories.map((category, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSortByCategory(category)}
                    >
                      {category}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </details>
        </div>
      </div>
      <div className="flex flex-col space-y-6 mt-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
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
                    onClick={() => navigate(`${BASE}events/${event.id}`)}
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
