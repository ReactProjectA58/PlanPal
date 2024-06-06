import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { addEvent, getUserContacts, inviteUser } from "../../services/event.service.js";
import { uploadCover } from "../../services/upload.service.js";
import Button from "../Button.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import {
  validateTitle,
  validateDescription,
  validateLocation,
  validateStartDate,
  validateEndDate,
  validateStartTime,
  validateEndTime,
} from "../../common/helpers/validationHelpers.js";
import { ArrowDown, GoBackArrow } from "../../common/helpers/icons.jsx";
import {
  EVENT_SPORTS_COVER,
  EVENT_ENTERTAINMENT_COVER,
  EVENT_CULTURE_AND_SCIENCE_COVER,
  EVENT_COVER_BY_DEFAULT,
} from "../../common/constants.js";

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
    category: "Entertainment",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [description, setDescription] = useState("");
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const inviteRef = useRef(null);
  const reoccurringRef = useRef(null);
  const categoryRef = useRef(null);
  const [isReoccurringOpen, setIsReoccurringOpen] = useState(false);
  const [selectedReoccurringOption, setSelectedReoccurringOption] = useState(false);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (reoccurringRef.current && !reoccurringRef.current.contains(event.target)) {
        setIsReoccurringOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (inviteRef.current && !inviteRef.current.contains(event.target)) {
        inviteRef.current.removeAttribute('open');
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [reoccurringRef, categoryRef, inviteRef]);

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
      [key]: key === "description" ? description : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInviteUser = (userHandle) => {
    setInvitedUsers((prevUsers) => [...prevUsers, userHandle]);
    alert(`${userHandle} was successfully added to the invite list.`);
  };

  const recurrenceOptions = [
    { value: "never", label: "Never" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "indefinitely", label: "Indefinitely" },
  ];

  const categoryOptions = [
    { value: "Entertainment", label: "Entertainment" },
    { value: "Sports", label: "Sports" },
    { value: "Culture & Science", label: "Culture & Science" },
    { value: "Other", label: "Other" },
  ];

  const getDefaultCoverByCategory = (category) => {
    switch (category) {
      case "Sports":
        return EVENT_SPORTS_COVER;
      case "Entertainment":
        return EVENT_ENTERTAINMENT_COVER;
      case "Culture & Science":
        return EVENT_CULTURE_AND_SCIENCE_COVER;
      default:
        return EVENT_COVER_BY_DEFAULT;
    }
  };

  const createEvent = async () => {
    const { title, description, location, startDate, startTime, endDate, endTime, category } = event;

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
      } else {
        coverURL = getDefaultCoverByCategory(category);
      }

      const newEvent = await addEvent(
        {
          ...event,
          creator: userData.handle,
          cover: coverURL,
        },
        invitedUsers
      );

      for (const userHandle of invitedUsers) {
        await inviteUser(newEvent.id, userData.handle, userHandle);
      }

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
        category: "Entertainment",
      });
      setCoverFile(null);
      setInvitedUsers([]);

      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <GoBackArrow onClick={() => navigate("/events")} />
      </div>

      <div className="flex flex-wrap -mx-2">
        {[
          { label: "Title", key: "title", type: "text" },
          { label: "Location", key: "location", type: "text" },
        ].map(({ label, key, type }) => (
          <div key={key} className="mb-4 px-2 w-full sm:w-1/2">
            <label htmlFor={`input-${key}`} className="block text-sm font-medium">
              {label} <span className="text-red-500">*</span>:
            </label>
            <div className="mt-1">
              <input
                type={type}
                value={event[key]}
                onChange={(e) => updateEvent(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
                className="shadow-sm block w-full sm:text-sm rounded-md"
              />
              {errors[key] && <div className="text-red-500 text-sm">{errors[key]}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap -mx-2">
        {[
          { label: "Start Date", key: "startDate", type: "date" },
          { label: "Start Time", key: "startTime", type: "time" },
          { label: "End Date", key: "endDate", type: "date" },
          { label: "End Time", key: "endTime", type: "time" },
        ].map(({ label, key, type }) => (
          <div key={key} className="mb-4 px-2 w-full sm:w-1/2">
            <label htmlFor={`input-${key}`} className="block text-sm font-medium">
              {label} <span className="text-red-500">*</span>:
            </label>
            <div className="mt-1">
              <input
                type={type}
                value={event[key]}
                onChange={(e) => updateEvent(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
                className="shadow-sm block w-full sm:text-sm rounded-md"
              />
              {errors[key] && <div className="text-red-500 text-sm">{errors[key]}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label htmlFor="input-description" className="block text-sm font-medium">
          Description:
        </label>
        <div className="mt-1">
          <textarea
            className="textarea textarea-bordered textarea-sm w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Public Event:</label>
        <div className="mt-1">
          <input
            type="checkbox"
            checked={event.isPublic}
            onChange={(e) => updateEvent(e.target.checked, "isPublic")}
            className="h-4 w-4 rounded"
          />
        </div>
      </div>

      <div className="mb-4" ref={reoccurringRef}>
        <label htmlFor="reoccurring-option" className="block text-sm font-medium">
          Reoccurring:
        </label>
        <div className="mt-1 relative">
          <button
            type="button"
            className="w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left sm:text-sm"
            onClick={() => setIsReoccurringOpen(!isReoccurringOpen)}
          >
            <span className="block truncate">
              {selectedReoccurringOption ? selectedReoccurringOption.label : "Select Occurrence"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowDown />
            </span>
          </button>
          {isReoccurringOpen && (
            <div className="origin-top-right absolute z-10 mt-1 w-full rounded-md glass bg-transparent ring-1 ring-black ring-opacity-5">
              {recurrenceOptions.map((option) => (
                <div
                  key={option.value}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:glass"
                  onClick={() => {
                    setSelectedReoccurringOption(option);
                    setIsReoccurringOpen(false);
                    updateEvent(option.value, "isReoccurring");
                  }}
                >
                  <span className="block truncate">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 relative" ref={categoryRef}>
        <label htmlFor="category" className="block text-sm font-medium">
          Category:
        </label>
        <div className="mt-1 relative">
          <button
            type="button"
            className="w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm"
            id="category"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span className="block truncate">
              {selectedCategoryOption ? selectedCategoryOption.label : "Select Category"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowDown />
            </span>
          </button>
          {isCategoryOpen && (
            <div className="origin-top-right absolute z-10 mt-1 w-full rounded-md glass bg-transparent ring-1 ring-black ring-opacity-5">
              {categoryOptions.map((option) => (
                <div
                  key={option.value}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:glass"
                  onClick={() => {
                    setSelectedCategoryOption(option);
                    setIsCategoryOpen(false);
                    updateEvent(option.value, "category");
                  }}
                >
                  <span className="block truncate">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {coverPreview && (
          <img src={coverPreview} alt="Cover Preview" className="w-96 h-64 object-cover rounded mb-2" />
        )}
      </div>

      <div className="flex items-center gap-8">
        <Button className="font-bold py-2 px-4 rounded" onClick={createEvent}>
          Create
        </Button>
        <Button onClick={() => document.getElementById("cover-upload").click()} className="font-bold py-2 px-4 rounded">
          Upload Cover
        </Button>
        <details className="dropdown" ref={inviteRef}>
          <summary className="font-bold py-2 px-4 rounded cursor-pointer">Invite Contact</summary>
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
        </details>
        <input type="file" id="cover-upload" style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
}
