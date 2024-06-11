import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import { displayMyEvents } from "../services/event.service";
import { AppContext } from "../context/AppContext";
import TopThreeEvents from "../components/Events/TopEvents";
import WeatherComponent from "../components/Weather/WeatherComponent";

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const { userData, loading: userLoading } = useContext(AppContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!userLoading && userData) {
          const myEvents = await displayMyEvents(userData.handle);
          setEvents(myEvents);
        }
      } catch (error) {
        console.error("Error fetching events in Dashboard:", error);
      }
    };

    fetchEvents();
  }, [userData, userLoading]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4" style={{ height: "70vh" }}>
        <div className="col-span-2 pt-32">
          <MonthCalendar
            events={events}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </div>
        <div className="col-span-1">
          <WeatherComponent />
        </div>
      </div>
      <div className="mt-2">
        {" "}
        {/* Adjusted margin top */}
        <TopThreeEvents />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  events: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
};

export default Dashboard;
