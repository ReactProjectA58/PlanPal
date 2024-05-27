import {
  format,
  add,
  sub,
  startOfDay,
  setHours,
  getHours,
  getMinutes,
  parseISO,
  differenceInMinutes,
  endOfDay,
} from "date-fns";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function DayCalendar({ events }) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  function previousDay() {
    setSelectedDay(sub(selectedDay, { days: 1 }));
  }

  function nextDay() {
    setSelectedDay(add(selectedDay, { days: 1 }));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) =>
    setHours(startOfDay(selectedDay), i)
  );

  const currentHour = getHours(currentTime);
  const currentMinute = getMinutes(currentTime);
  const isToday =
    format(selectedDay, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd");
  const currentTimePosition = (currentHour + currentMinute / 60) * 3; 

  const eventsForSelectedDay = events.filter((event) => {
    const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
    const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
    return (
      format(eventStart, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd") ||
      format(eventEnd, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd") ||
      (eventStart < startOfDay(selectedDay) && eventEnd > endOfDay(selectedDay))
    );
  });

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={previousDay}
            className="flex items-center justify-center p-2 text-400 hover:text-500"
          >
            <span className="sr-only">Previous day</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">
            {format(selectedDay, "EEEE, MMMM d, yyyy")}
          </h2>
          <button
            type="button"
            onClick={nextDay}
            className="flex items-center justify-center p-2 text-400 hover:text-500"
          >
            <span className="sr-only">Next day</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="border p-4 relative">
          <div className="relative">
            {hours.map((hour, index) => (
              <div key={index} className="flex items-center border-t h-12">
                <div className="w-16 text-right pr-2 text-xs">
                  {format(hour, "HH:mm")}
                </div>
              </div>
            ))}
            {eventsForSelectedDay.map((event) => {
              const eventStart = parseISO(
                `${event.startDate}T${event.startTime}`
              );
              const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);

              const dayStart = startOfDay(selectedDay);
              const dayEnd = endOfDay(selectedDay);

              const actualStart = eventStart < dayStart ? dayStart : eventStart;
              const actualEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

              const eventStartHour = getHours(actualStart);

              const eventStartMinute = getMinutes(actualStart);
              const startTop = (eventStartHour + eventStartMinute / 60) * 3; // 3rem per hour
              const eventHeight =
                (differenceInMinutes(actualEnd, actualStart) / 60) * 3; // 3rem per hour

              return (
                <div
                  key={event.id}
                  className="absolute left-1 w-full pl-16 pr-4 bg-blue-300 bg-opacity-20 text-white text-xs rounded-lg shadow-lg"
                  style={{
                    top: `${startTop}rem`,
                    height: `${eventHeight}rem`,
                  }}
                >
                  <div className="px-2 py-1">
                    <div>{event.title}</div>
                    <div>
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                </div>
              );
            })}
            {isToday && (
              <div
                className="absolute left-0 w-full border-t-2 border-red-500"
                style={{ top: `${currentTimePosition}rem` }}
              >
                <div className="absolute left-16 -mt-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

DayCalendar.propTypes = {
  events: PropTypes.array.isRequired,
};

export default DayCalendar;
