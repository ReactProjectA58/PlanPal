import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import {
  getEventById,
  updateEvent,
  deleteEvent,
  getUserContacts,
  inviteUser,
  uninviteUser,
} from "../../services/event.service.js";
import {
  validateTitle,
  validateDescription,
  validateLocation,
  validateStartDate,
  validateEndDate,
  validateStartTime,
  validateEndTime,
} from "../../common/helpers/validationHelpers.js";
import Button from "../Button.jsx";
import {
  GoBackArrow,
  DeleteEvent,
  ArrowDown,
} from "../../common/helpers/icons.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { uploadCover } from "../../services/upload.service.js";
import "./styles.css";
import { errorChecker, themeChecker } from "../../common/helpers/toast.js";
import showConfirmDialog from "../ConfirmDialog.jsx";
import { BASE } from "../../common/constants.js";

const MAPBOX_TOKEN =
  "sk.eyJ1IjoibWRvbmV2diIsImEiOiJjbHhia2xlMzAwZWx5MmlzODhzdm83M3RrIn0.I9KO-Iji0OdFNuq23omNhQ";

export default function UpdateEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [finalDate, setFinalDate] = useState("");
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const inviteRef = useRef(null);
  const uninviteRef = useRef(null);
  const fileInputRef = useRef(null);
  const reoccurringRef = useRef(null);
  const categoryRef = useRef(null);
  const [isReoccurringOpen, setIsReoccurringOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        if (["weekly", "monthly", "yearly"].includes(eventData.isReoccurring)) {
          setFinalDate(eventData.finalDate);
          setIsIndefinite(eventData.isReoccurring === "indefinitely");
        }
      } catch (error) {
        setError("Failed to fetch event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (userData?.handle) {
        const contactsData = await getUserContacts(userData.handle);
        setContacts(contactsData);
      }
    };

    fetchContacts();
  }, [userData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        reoccurringRef.current &&
        !reoccurringRef.current.contains(event.target)
      ) {
        setIsReoccurringOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (inviteRef.current && !inviteRef.current.contains(event.target)) {
        inviteRef.current.removeAttribute("open");
      }
      if (uninviteRef.current && !uninviteRef.current.contains(event.target)) {
        uninviteRef.current.removeAttribute("open");
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [reoccurringRef, categoryRef, inviteRef, uninviteRef]);

  const updateEventData = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
  };

  const handleUpdateEvent = async () => {
    const {
      title,
      description,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
    } = event;

    const validationErrors = {
      title: validateTitle(title),
      description: validateDescription(description),
      location: validateLocation(location),
      startDate: validateStartDate(startDate),
      startTime: validateStartTime(startTime),
      endDate: validateEndDate(endDate, startDate),
      endTime: validateEndTime(endTime),
    };

    const filteredErrors = Object.keys(validationErrors).reduce((acc, key) => {
      if (validationErrors[key]) acc[key] = validationErrors[key];
      return acc;
    }, {});

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    try {
      await updateEvent(eventId, event);
      navigate(`${BASE}events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      errorChecker("Failed to update event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    showConfirmDialog(
      "Are you sure you want to delete this event?",
      async () => {
        try {
          const result = await deleteEvent(eventId);
          if (result) {
            navigate(`${BASE}my-events`);
          } else {
            errorChecker("Failed to delete event. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          errorChecker("Failed to delete event. Please try again.");
        }
      }
    );
  };

  const handleInviteUser = async (userHandle) => {
    if (event.peopleGoing && event.peopleGoing[userHandle]) {
      themeChecker("This user is already invited to this event!");
      if (inviteRef.current) {
        inviteRef.current.open = false;
      }
      return;
    }

    try {
      const result = await inviteUser(eventId, userData.handle, userHandle);
      if (result) {
        themeChecker(`${userHandle} was successfully invited.`);
        if (inviteRef.current) {
          inviteRef.current.open = false;
        }
      } else {
        errorChecker(`Failed to invite user ${userHandle}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      errorChecker("Failed to invite user. Please try again.");
    }
  };

  const handleUninviteUser = async (userHandle) => {
    try {
      const result = await uninviteUser(eventId, userHandle);
      if (result) {
        themeChecker(`${userHandle} was successfully kicked out.`);
        if (uninviteRef.current) {
          uninviteRef.current.open = false;
        }
      } else {
        errorChecker(`Failed to uninvite user ${userHandle}`);
      }
    } catch (error) {
      console.error("Error uninviting user:", error);
      errorChecker("Failed to uninvite user. Please try again.");
    }
  };

  const handleUpdateCover = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const coverURL = await uploadCover(event.title, file);
        const updatedEvent = { ...event, cover: coverURL };
        await updateEvent(eventId, updatedEvent);
        setEvent(updatedEvent);
        themeChecker("Cover image updated successfully.");
      } catch (error) {
        console.error("Error updating cover image:", error);
        errorChecker("Failed to update cover image. Please try again.");
      }
    }
  };

  const handleLocationChange = async (e) => {
    const value = e.target.value;
    updateEventData(value, "location");
    if (value.length > 2) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      setSuggestions(data.features.map((feature) => feature.place_name));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    updateEventData(suggestion, "location");
    setSuggestions([]);
  };

  if (!event) return <div className="text-center mt-10">No event found.</div>;

  return (
    <div className="update-event-form p-4 max-w-3xl mx-auto rounded-lg mt-8 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Update Event</h1>
        <div className="flex items-center space-x-2">
          <details className="dropdown" ref={inviteRef}>
            <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
              Invite
            </summary>
            <div
              className="dropdown-menu absolute max-h-48 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black hover:glass"
              style={{ zIndex: 999 }}
            >
              <ul className="space-y-2">
                {contacts.length === 0 ? (
                  <li className="p-2">No contacts found.</li>
                ) : (
                  contacts.map((contact) => (
                    <li
                      key={contact}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <a onClick={() => handleInviteUser(contact)}>{contact}</a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </details>
          <details className="dropdown" ref={uninviteRef}>
            <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
              Uninvite
            </summary>
            <div
              className="dropdown-menu absolute max-h-48 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black hover:glass"
              style={{ zIndex: 999 }}
            >
              <ul className="space-y-2">
                {Object.keys(event.peopleGoing || {}).filter(
                  (handle) => handle !== event.creator
                ).length === 0 ? (
                  <li className="p-2">No participants to uninvite.</li>
                ) : (
                  Object.keys(event.peopleGoing || {})
                    .filter((handle) => handle !== event.creator)
                    .map((participant) => (
                      <li
                        key={participant}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        <a onClick={() => handleUninviteUser(participant)}>
                          {participant}
                        </a>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </details>
          <Button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current.click()}
          >
            Update Cover
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleUpdateCover}
          />
          <DeleteEvent onClick={handleDeleteEvent} />
          <GoBackArrow onClick={() => navigate(`${BASE}events/${eventId}`)} />
        </div>
      </div>
      {[
        { label: "Title", key: "title", type: "text" },
        { label: "Start Date", key: "startDate", type: "date" },
        { label: "Start Time", key: "startTime", type: "time" },
        { label: "End Date", key: "endDate", type: "date" },
        { label: "End Time", key: "endTime", type: "time" },
        { label: "Location", key: "location", type: "text" },
        { label: "Description", key: "description", type: "textarea" },
      ].map(({ label, key, type }) => (
        <div key={key} className={`event-${key} mb-4`}>
          <label htmlFor={`input-${key}`} className="block font-semibold mb-1">
            {label}:
          </label>
          <div className="input-field relative">
            {type === "textarea" ? (
              <textarea
                className="textarea textarea-bordered textarea-sm w-full"
                value={event[key]}
                onChange={(e) => updateEventData(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
                cols="30"
                rows="10"
              ></textarea>
            ) : (
              <input
                className="w-full p-2 border rounded bg-white"
                type={type}
                value={event[key]}
                onChange={(e) =>
                  type === "text" && key === "location"
                    ? handleLocationChange(e)
                    : updateEventData(e.target.value, key)
                }
                name={`input-${key}`}
                id={`input-${key}`}
              />
            )}
            {errors[key] && (
              <div className="text-red-500 text-sm mt-1">{errors[key]}</div>
            )}
            {key === "location" && suggestions.length > 0 && (
              <ul className="order border-gray-300 rounded mt-1 max-h-40 overflow-y-auto absolute z-50 backdrop-blur-lg bg-white/10 text-black">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:glass cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center space-x-2 mb-4">
        <label className="font-semibold">Public Event:</label>
        <input
          type="checkbox"
          checked={event.isPublic}
          onChange={(e) => updateEventData(e.target.checked, "isPublic")}
        />
      </div>

      <div className="mb-4 relative" ref={reoccurringRef}>
        <label htmlFor="reoccurring-option" className="block font-semibold">
          Reoccurring:
        </label>
        <div className="mt-1 relative">
          <button
            type="button"
            className="w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm border-2 border-gray-700 bg-white"
            id="reoccurring-option"
            onClick={() => setIsReoccurringOpen(!isReoccurringOpen)}
          >
            <span className="block truncate">
              {event.isReoccurring ? event.isReoccurring : "Select Occurrence"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowDown />
            </span>
          </button>
          {isReoccurringOpen && (
            <div
              className="origin-top-right absolute mt-1 w-full rounded-md backdrop-blur-lg bg-white/10 ring-1 ring-black ring-opacity-5 border-2 border-gray-700 text-black"
              style={{ zIndex: 999 }}
            >
              {["never", "weekly", "monthly", "yearly"].map((option) => (
                <div
                  key={option}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:glass"
                  onClick={() => {
                    updateEventData(option, "isReoccurring");
                    setIsReoccurringOpen(false);
                    if (["weekly", "monthly", "yearly"].includes(option)) {
                      setFinalDate("");
                      setIsIndefinite(false);
                    }
                  }}
                >
                  <span className="block truncate">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {["weekly", "monthly", "yearly"].includes(event.isReoccurring) && (
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isIndefinite}
                onChange={(e) => setIsIndefinite(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label className="ml-2 text-sm font-medium">Indefinitely</label>
            </div>
            {!isIndefinite && (
              <>
                <label
                  htmlFor="final-date"
                  className="block text-sm font-medium mt-2"
                >
                  Final Date:
                </label>
                <input
                  type="date"
                  id="final-date"
                  className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                  value={finalDate}
                  onChange={(e) => {
                    setFinalDate(e.target.value);
                    updateEventData(e.target.value, "finalDate");
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 relative" ref={categoryRef}>
        <label htmlFor="category-option" className="block font-semibold">
          Category:
        </label>
        <div className="mt-1 relative">
          <button
            type="button"
            className="w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm border-2 border-gray-700 bg-white"
            id="category-option"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="block truncate">
              {event.category ? event.category : "Select Category"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowDown />
            </span>
          </button>
          {isCategoryOpen && (
            <div
              className="origin-top-right absolute mt-1 w-full rounded-md backdrop-blur-lg bg-white/10 ring-1 ring-black ring-opacity-5 border-2 border-gray-700 text-black"
              style={{ zIndex: 999 }}
            >
              {["Entertainment", "Sports", "Culture & Science"].map(
                (option) => (
                  <div
                    key={option}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:glass"
                    onClick={() => {
                      updateEventData(option, "category");
                      setIsCategoryOpen(false);
                    }}
                  >
                    <span className="block truncate">{option}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button className="btn btn-primary" onClick={handleUpdateEvent}>
          Update Event
        </Button>
      </div>
    </div>
  );
}
