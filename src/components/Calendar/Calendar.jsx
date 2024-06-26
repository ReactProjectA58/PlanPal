import { useState, useEffect, useContext } from "react";
import DayCalendar from "./DayCalendar";
import WeekCalendar from "./WeekCalendar";
import WorkWeekCalendar from "./WorkWeekCalendar";
import MonthCalendar from "./MonthCalendar";
import YearCalendar from "./YearCalendar";
import { displayMyEvents } from "../../services/event.service";
import { AppContext } from "../../context/AppContext";

export default function Calendar() {
  const [view, setView] = useState("daily");
  const [events, setEvents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { userData, loading: userLoading } = useContext(AppContext);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userLoading && userData) {
        const myEvents = await displayMyEvents(userData.handle);
        setEvents(myEvents);
      }
    };

    fetchEvents();
  }, [userData, userLoading]);

  const handleViewChange = (newView) => {
    setView(newView);
    setIsDropdownOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setView("daily");
  };

  const renderView = () => {
    switch (view) {
      case "daily":
        return (
          <DayCalendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        );
      case "weekly":
        return <WeekCalendar events={events} onDateClick={handleDateChange} />;
      case "work-week":
        return (
          <WorkWeekCalendar events={events} onDateClick={handleDateChange} />
        );
      case "monthly":
        return <MonthCalendar events={events} onDateClick={handleDateChange} />;
      case "yearly":
        return <YearCalendar events={events} onDateClick={handleDateChange} />;
      default:
        return <MonthCalendar />;
    }
  };

  return (
    <div className="calendar-container p-4">
      <div className="view-selector flex gap-2 mb-4">
        <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
          <div
            tabIndex={0}
            role="button"
            className="btn btn-secondary"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Calendar Views
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => handleViewChange("daily")}>Daily</a>
              </li>
              <li>
                <a onClick={() => handleViewChange("weekly")}>Weekly</a>
              </li>
              <li>
                <a onClick={() => handleViewChange("work-week")}>Work Week</a>
              </li>
              <li>
                <a onClick={() => handleViewChange("monthly")}>Monthly</a>
              </li>
              <li>
                <a onClick={() => handleViewChange("yearly")}>Yearly</a>
              </li>
            </ul>
          )}
        </div>
      </div>
      {renderView()}
    </div>
  );
}
