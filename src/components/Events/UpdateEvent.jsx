import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import { getEventById, updateEvent, deleteEvent, getUserContacts, inviteUser, uninviteUser } from '../../services/event.service.js';
import { validateTitle, validateDescription, validateLocation, validateStartDate, validateEndDate, validateStartTime, validateEndTime } from '../../common/helpers/validationHelpers.js';
import Button from '../Button.jsx';
import { GoBackArrow, DeleteEvent } from '../../common/helpers/icons.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import { uploadCover } from '../../services/upload.service.js';
import './styles.css'; // Import your CSS file here

const MAPBOX_TOKEN = 'sk.eyJ1IjoibWRvbmV2diIsImEiOiJjbHg3aXhma2cxeWlnMmpxdTl3aWcya3I2In0.fxZquQpnSrvq144fj9kS-Q';

export default function UpdateEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const inviteRef = useRef(null);
  const uninviteRef = useRef(null);
  const fileInputRef = useRef(null);
  const [finalDate, setFinalDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        if (["weekly", "monthly", "yearly"].includes(eventData.isReoccurring)) {
          setFinalDate(eventData.finalDate);
        }
      } catch (error) {
        setError('Failed to fetch event data. Please try again.');
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

  const updateEventData = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
  };

  const handleUpdateEvent = async () => {
    const { title, description, location, startDate, startTime, endDate, endTime } = event;

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
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        const result = await deleteEvent(eventId);
        if (result) {
          navigate("/my-events");
        } else {
          alert("Failed to delete event. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleInviteUser = async (userHandle) => {
    if (event.peopleGoing && event.peopleGoing[userHandle]) {
      alert("This user is already invited to this event!");
      if (inviteRef.current) {
        inviteRef.current.open = false;
      }
      return;
    }

    try {
      const result = await inviteUser(eventId, userData.handle, userHandle);
      if (result) {
        alert(`${userHandle} was successfully invited.`);
        if (inviteRef.current) {
          inviteRef.current.open = false;
        }
      } else {
        alert(`Failed to invite user ${userHandle}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("Failed to invite user. Please try again.");
    }
  };

  const handleUninviteUser = async (userHandle) => {
    try {
      const result = await uninviteUser(eventId, userHandle);
      if (result) {
        alert(`${userHandle} was successfully kicked out.`);
        if (uninviteRef.current) {
          uninviteRef.current.open = false;
        }
      } else {
        alert(`Failed to uninvite user ${userHandle}`);
      }
    } catch (error) {
      console.error("Error uninviting user:", error);
      alert("Failed to uninvite user. Please try again.");
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
        alert("Cover image updated successfully.");
      } catch (error) {
        console.error("Error updating cover image:", error);
        alert("Failed to update cover image. Please try again.");
      }
    }
  };

  const handleLocationChange = async (e) => {
    const value = e.target.value;
    updateEventData(value, "location");
    if (value.length > 2) {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${MAPBOX_TOKEN}`);
      const data = await response.json();
      setSuggestions(data.features.map(feature => feature.place_name));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    updateEventData(suggestion, "location");
    setSuggestions([]);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!event) return <div className="text-center mt-10">No event found.</div>;

  return (
    <div className="update-event-container px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Update Event</h1>
        <div className="flex items-center space-x-2">
          <details className="dropdown" ref={inviteRef}>
            <summary className="m-1 btn btn-secondary">Invite</summary>
            <div className="dropdown-content max-h-48 overflow-y-auto mt-2">
              <ul className="space-y-2">
                {contacts.length === 0 ? (
                  <li className="p-2">No contacts found.</li>
                ) : (
                  contacts.map((contact) => (
                    <li key={contact} className="p-2 hover:bg-gray-200 cursor-pointer">
                      <a onClick={() => handleInviteUser(contact)}>{contact}</a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </details>
          <details className="dropdown" ref={uninviteRef}>
            <summary className="m-1 btn btn-secondary">Uninvite</summary>
            <div className="dropdown-content max-h-48 overflow-y-auto mt-2">
              <ul className="space-y-2">
                {Object.keys(event.peopleGoing || {}).filter(handle => handle !== event.creator).length === 0 ? (
                  <li className="p-2">No participants to uninvite.</li>
                ) : (
                  Object.keys(event.peopleGoing || {}).filter(handle => handle !== event.creator).map((participant) => (
                    <li key={participant} className="p-2 hover:bg-gray-200 cursor-pointer">
                      <a onClick={() => handleUninviteUser(participant)}>{participant}</a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </details>
          <Button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
            Update Cover
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleUpdateCover}
          />
          <DeleteEvent onClick={handleDeleteEvent} />
          <GoBackArrow onClick={() => navigate(`/events/${eventId}`)} />
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
          <label htmlFor={`input-${key}`} className="block font-semibold mb-1">{label}:</label>
          <div className="input-field">
            {type === "textarea" ? (
              <textarea
                className="w-full p-2 border rounded"
                value={event[key]}
                onChange={(e) => updateEventData(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
                cols="30"
                rows="10"
              ></textarea>
            ) : (
              <input
                className="w-full p-2 border rounded"
                type={type}
                value={event[key]}
                onChange={(e) => type === 'text' && key === 'location' ? handleLocationChange(e) : updateEventData(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
              />
            )}
            {errors[key] && <div className="text-red-500 text-sm mt-1">{errors[key]}</div>}
            {key === 'location' && suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSuggestionClick(suggestion)}>
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

      <div className="mb-4">
        <label htmlFor="reoccurring-option" className="block text-sm font-medium">Reoccurring:</label>
        <div className="mt-1 relative">
          <select
            id="reoccurring-option"
            value={event.isReoccurring}
            onChange={(e) => {
              updateEventData(e.target.value, "isReoccurring");
              if (["weekly", "monthly", "yearly"].includes(e.target.value)) {
                setFinalDate(""); // Reset finalDate if it's one of the recurring options
              }
            }}
            className="w-full p-2 border rounded"
          >
            <option value="never">Never</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="indefinitely">Indefinitely</option>
          </select>
        </div>
        {["weekly", "monthly", "yearly"].includes(event.isReoccurring) && (
          <div className="mt-4">
            <label htmlFor="final-date" className="block text-sm font-medium">Final Date:</label>
            <input
              type="date"
              id="final-date"
              className="mt-1 block w-full p-2 border rounded"
              value={finalDate}
              onChange={(e) => {
                setFinalDate(e.target.value);
                updateEventData(e.target.value, "finalDate");
              }}
            />
          </div>
        )}
      </div>

      <div className="mb-4 w-full">
        <label htmlFor="category-option" className="block font-semibold">Category:</label>
        <select
          id="category-option"
          value={event.category}
          onChange={(e) => updateEventData(e.target.value, "category")}
          className="w-full p-2 border rounded"
        >
          <option value="Entertainment">Entertainment</option>
          <option value="Sport">Sport</option>
          <option value="Culture & Science">Culture & Science</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <Button className="btn btn-primary" onClick={handleUpdateEvent}>
          Update Event
        </Button>
      </div>
    </div>
  );
}