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

  const renderView = () => {
    switch (view) {
      case "daily":
        return <DayCalendar events={events} />;
      case "weekly":
        return <WeekCalendar events={events} />;
      case "work-week":
        return <WorkWeekCalendar />;
      case "monthly":
        return <MonthCalendar />;
      case "yearly":
        return <YearCalendar />;
      default:
        return <MonthCalendar />;
    }
  };

  return (
    <div className="calendar-container p-4">
      <div className="view-selector flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={() => setView('daily')}>Daily</button>
        <button className="btn btn-primary" onClick={() => setView('weekly')}>Weekly</button>
        <button className="btn btn-primary" onClick={() => setView('work-week')}>Work Week</button>
        <button className="btn btn-primary" onClick={() => setView('monthly')}>Monthly</button>
        <button className="btn btn-primary" onClick={() => setView('yearly')}>Yearly</button>
      </div>
      {renderView()}
    </div>
  );
}