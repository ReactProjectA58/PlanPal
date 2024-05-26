import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { addEvent } from "../../services/event.service.js";
import Button from "../Button.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { validateTitle, validateDescription, validateLocation, validateStartDate, validateEndDate, validateStartTime, validateEndTime } from "../../common/helpers/validationHelpers.js";

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
  });

  const [errors, setErrors] = useState({});
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const updateEvent = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
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
      await addEvent({
        ...event,
        creator: userData.handle,
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
      });
    
      navigate("/my-events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }    
  };

  return (
    <div className="outer-create-event-container">
      <div className="inner-create-event-container">
        <div className="create-event-header">
          <h1>Create Event</h1>
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
          <label htmlFor="reoccurring-option">Reoccurring Option:</label>
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

        <div className="create-button">
          <Button className="create-button-style" onClick={createEvent}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
