import { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import MonthCalendar from "../components/Calendar/MonthCalendar";
import DayCalendar from "../components/Calendar/DayCalendar";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ minHeight: "75vh" }}>
        <div className="flex flex-col h-full">
          <div className="flex-grow pt-20">
            <MonthCalendar
              events={events}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          </div>
          <div className="mt-4">
            <WeatherComponent />
          </div>
        </div>
        <div className="pt-20 flex flex-col h-full">
          <div className="flex-grow" style={{ maxHeight: "110vh", overflowY: "auto" }}>
            <DayCalendar
              events={events}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
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
