import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { addEvent } from "../../services/event.service.js";
import Button from "../Button.jsx";
import { AppContext } from "../../context/AppContext.jsx";

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
    isRecurring: false,
  });

  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const updateEvent = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
  };

  const createEvent = async () => {
    try {
        const formattedDate = new Date().toISOString();
      await addEvent({
        ...event,
        createdOn: formattedDate,
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
        isRecurring: false,
    });
    
    navigate("/events");
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

        <div className="event-isRecurring">
          <label>
            Recurring Event:
            <input
              type="checkbox"
              checked={event.isRecurring}
              onChange={(e) => updateEvent(e.target.checked, "isRecurring")}
            />
          </label>
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
