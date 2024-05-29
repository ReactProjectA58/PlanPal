import {
  format,
  add,
  sub,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  setHours,
  getHours,
  getMinutes,
  parseISO,
  differenceInMinutes,
} from "date-fns";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function WorkWeekCalendar({ events, onDateClick }) {
  const [selectedWeek, setSelectedWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  function previousWeek() {
    setSelectedWeek(sub(selectedWeek, { weeks: 1 }));
  }

  function nextWeek() {
    setSelectedWeek(add(selectedWeek, { weeks: 1 }));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const workDaysOfWeek = Array.from({ length: 5 }, (_, i) =>
    add(selectedWeek, { days: i })
  ); // Start from index 1 to skip Sunday

  const currentHour = getHours(currentTime);
  const currentMinute = getMinutes(currentTime);
  const isCurrentWeek =
    format(startOfWeek(currentTime, { weekStartsOn: 1 }), "yyyy-MM-dd") ===
    format(selectedWeek, "yyyy-MM-dd");
  const currentTimePosition = (currentHour + currentMinute / 60) * 3;

  const hours = Array.from({ length: 24 }, (_, i) =>
    setHours(startOfDay(new Date()), i)
  );

  return (
    <div className="pt-16">
      <div className="px-4 mx-auto sm:px-7 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={previousWeek}
            className="flex items-center justify-center p-2 text-400 hover:text-500"
          >
            <span className="sr-only">Previous week</span>
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
            {format(selectedWeek, "MMMM d")} -{" "}
            {format(
              endOfWeek(selectedWeek, { weekStartsOn: 1 }),
              "MMMM d, yyyy"
            )}
          </h2>
          <button
            type="button"
            onClick={nextWeek}
            className="flex items-center justify-center p-2 text-400 hover:text-500"
          >
            <span className="sr-only">Next week</span>
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
        <div className="relative border w-full">
          <div className="grid grid-cols-6">
            <div className="border-r w-full">
              <div className="h-12 flex flex-col items-center justify-center border-b bg-gray-100 py-2">
                <h3 className="text-sm">Hours</h3>
              </div>
              {hours.map((hour, index) => (
                <div
                  key={index}
                  className="h-12 flex items-center justify-center border-b"
                >
                  <div className="w-16 text-right pr-2 text-xs">
                    {format(hour, "HH:mm")}
                  </div>
                </div>
              ))}
            </div>
            {workDaysOfWeek.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="relative border-r w-full cursor-pointer"
                onClick={() => onDateClick(day)}
              >
                <div className="flex flex-col items-center justify-center border-b bg-gray-100 py-2 h-12">
                  <h3 className="text-sm">{format(day, "EEE, MMM d")}</h3>
                </div>
                <div className="relative">
                  {hours.map((hour, index) => (
                    <div key={index} className="h-12 border-b"></div>
                  ))}
                  {events
                    .filter((event) => {
                      const eventStart = parseISO(
                        `${event.startDate}T${event.startTime}`
                      );
                      const eventEnd = parseISO(
                        `${event.endDate}T${event.endTime}`
                      );
                      return (
                        format(eventStart, "yyyy-MM-dd") ===
                          format(day, "yyyy-MM-dd") ||
                        format(eventEnd, "yyyy-MM-dd") ===
                          format(day, "yyyy-MM-dd") ||
                        (eventStart < startOfDay(day) &&
                          eventEnd > endOfDay(day))
                      );
                    })
                    .map((event, index) => {
                      const eventStart = parseISO(
                        `${event.startDate}T${event.startTime}`
                      );
                      const eventEnd = parseISO(
                        `${event.endDate}T${event.endTime}`
                      );

                      const dayStart = startOfDay(day);
                      const dayEnd = endOfDay(day);

                      const actualStart =
                        eventStart < dayStart ? dayStart : eventStart;
                      const actualEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

                      const eventStartHour = getHours(actualStart);
                      const eventStartMinute = getMinutes(actualStart);
                      const startTop =
                        (eventStartHour + eventStartMinute / 60) * 3;
                      const eventHeight =
                        (differenceInMinutes(actualEnd, actualStart) / 60) * 3;

                      return (
                        <div
                          key={index}
                          className="absolute left-0 right-0 m-1 bg-blue-500 bg-opacity-20 text-white text-xs rounded px-1 py-0.5"
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
                  {isCurrentWeek &&
                    format(currentTime, "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd") && (
                      <div
                        className="absolute left-0 right-0 mx-1 border-t-2 border-red-500"
                        style={{ top: `${currentTimePosition}rem` }}
                      >
                        <div className="absolute left-0 -mt-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

WorkWeekCalendar.propTypes = {
  events: PropTypes.array.isRequired,
  onDateClick: PropTypes.func.isRequired,
};

export default WorkWeekCalendar;
