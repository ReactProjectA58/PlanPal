import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { addEvent, getUserContacts, inviteUser } from "../../services/event.service.js";
import { uploadCover } from "../../services/upload.service.js";
import Button from "../Button.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { validateTitle, validateDescription, validateLocation, validateStartDate, validateEndDate, validateStartTime, validateEndTime } from "../../common/helpers/validationHelpers.js";
import { GoBackArrow } from "../../common/helpers/icons.jsx"; 

export default function CreateEvent() {
  const [event, setEvent] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    isPublic: false,
    isReoccurring: "never",
    category: "Entertainment", // Added category field
  });
  const [coverFile, setCoverFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const inviteRef = useRef(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (userData?.handle) {
        const contactsData = await getUserContacts(userData.handle);
        setContacts(contactsData);
      }
    };

    fetchContacts();
  }, [userData]);

  const updateEvent = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const createEvent = async () => {
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
      let coverURL = "";
      if (coverFile) {
        coverURL = await uploadCover(event.title, coverFile);
      }

      const newEvent = await addEvent({
        ...event,
        creator: userData.handle,
        cover: coverURL,
      });

      setEvent({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        description: "",
        isPublic: false,
        isReoccurring: "never",
        category: "Entertainment", // Reset category field
      });
      setCoverFile(null);

      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleInviteUser = async (userHandle) => {
    try {
      const result = await inviteUser(event.id, userData.handle, userHandle);
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

  return (
    <div className="outer-create-event-container">
      <div className="inner-create-event-container">
        <div className="flex justify-between items-center mb-4">
          <h1>Create Event</h1>
          <GoBackArrow onClick={() => navigate("/events")} />
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
          <div key={key} className={`event-${key}`}>
            <label htmlFor={`input-${key}`}>{label}:</label>
            <div className="input-field">
              {type === "textarea" ? (
                <textarea
                  className={`${key}-input-style`}
                  value={event[key]}
                  onChange={(e) => updateEvent(e.target.value, key)}
                  name={`input-${key}`}
                  id={`input-${key}`}
                  cols="30"
                  rows="10"
                  style={{ boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.5)" }}
                ></textarea>
              ) : (
                <input
                  className={`${key}-input-style`}
                  type={type}
                  value={event[key]}
                  onChange={(e) => updateEvent(e.target.value, key)}
                  name={`input-${key}`}
                  id={`input-${key}`}
                  style={{ boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.5)" }}
                />
              )}
              {errors[key] && <div className="error-message">{errors[key]}</div>}
            </div>
          </div>
        ))}

        <div className="event-isPublic">
          <label>
            Public Event:
            <input
              type="checkbox"
              checked={event.isPublic}
              onChange={(e) => updateEvent(e.target.checked, "isPublic")}
            />
          </label>
        </div>
        <div className="event-reoccurring-option">
          <label htmlFor="reoccurring-option">Reoccurring:</label>
          <select
            id="reoccurring-option"
            value={event.isReoccurring}
            onChange={(e) => updateEvent(e.target.value, "isReoccurring")}
            className="reoccurring-option-style"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Indefinitely">Indefinitely</option>
            <option value="Never">Never</option>
          </select>
        </div>
        <div className="event-category">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={event.category}
            onChange={(e) => updateEvent(e.target.value, "category")}
            className="category-option-style"
          >
            <option value="Entertainment">Entertainment</option>
            <option value="Sports">Sports</option>
            <option value="Culture & Science">Culture & Science</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="create-button-style" onClick={createEvent}>
            Create
          </Button>
          <Button className="upload-button-style" onClick={() => document.getElementById('cover-upload').click()}>
            Upload Cover
          </Button>
          <input
            type="file"
            id="cover-upload"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* <details className="dropdown" ref={inviteRef}>
            <summary className="m-1 btn btn-secondary">Invite</summary>
            <div className="max-h-48 overflow-y-auto mt-2">
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
          </details> */}
        </div>
      </div>
    </div>
  );
}
