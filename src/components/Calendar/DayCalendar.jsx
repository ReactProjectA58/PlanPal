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

function DayCalendar({ events, selectedDate, onDateChange }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  function previousDay() {
    const newSelectedDate = sub(selectedDate, { days: 1 });
    onDateChange(newSelectedDate);
  }

  function nextDay() {
    const newSelectedDate = add(selectedDate, { days: 1 });
    onDateChange(newSelectedDate);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) =>
    setHours(startOfDay(selectedDate), i)
  );

  const currentHour = getHours(currentTime);
  const currentMinute = getMinutes(currentTime);
  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd");
  const currentTimePosition = (currentHour + currentMinute / 60) * 3;

  const eventsForSelectedDay = events.filter((event) => {
    const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
    const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
    return (
      format(eventStart, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ||
      format(eventEnd, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ||
      (eventStart < startOfDay(selectedDate) && eventEnd > endOfDay(selectedDate))
    );
  });

  const groupOverlappingEvents = (events) => {
    const sortedEvents = events.sort(
      (a, b) => parseISO(`${a.startDate}T${a.startTime}`) - parseISO(`${b.startDate}T${b.startTime}`)
    );

    const groups = [];
    let currentGroup = [];

    sortedEvents.forEach((event, index) => {
      const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
      if (currentGroup.length === 0) {
        currentGroup.push(event);
      } else {
        const lastEventInGroup = currentGroup[currentGroup.length - 1];
        const lastEventEnd = parseISO(`${lastEventInGroup.endDate}T${lastEventInGroup.endTime}`);

        if (eventStart < lastEventEnd) {
          currentGroup.push(event);
        } else {
          groups.push(currentGroup);
          currentGroup = [event];
        }
      }

      if (index === sortedEvents.length - 1) {
        groups.push(currentGroup);
      }
    });

    return groups;
  };

  const eventGroups = groupOverlappingEvents(eventsForSelectedDay);

  const gap = 2; 

  return (
    <div className="pt-16 w-full">
      <div className="px-4 mx-auto sm:px-7 md:px-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={previousDay}
            className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-500"
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
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
          <button
            type="button"
            onClick={nextDay}
            className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-500"
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
        <div className="border p-4 relative overflow-hidden max-w-full">
          <div className="relative">
            {hours.map((hour, index) => (
              <div key={index} className="flex flex-col justify-start border-t h-12">
                <div className="w-16 text-right pr-2 text-xs">
                  {format(hour, "HH:mm")}
                </div>
              </div>
            ))}
            {eventGroups.map((group) => {
              const groupLength = group.length;
              const eventWidth = (100 - gap * (groupLength - 1)) / groupLength;

              return group.map((event, index) => {
                const eventStart = parseISO(
                  `${event.startDate}T${event.startTime}`
                );

                const dayStart = startOfDay(selectedDate);
                const dayEnd = endOfDay(selectedDate);

                const actualStart =
                  eventStart < dayStart ? dayStart : eventStart;
                const actualEnd = parseISO(`${event.endDate}T${event.endTime}`) > dayEnd ? dayEnd : parseISO(`${event.endDate}T${event.endTime}`);

                const eventStartHour = getHours(actualStart);
                const eventStartMinute = getMinutes(actualStart);
                const startTop = (eventStartHour + eventStartMinute / 60) * 3;
                const eventHeight =
                  (differenceInMinutes(actualEnd, actualStart) / 60) * 3;

                const eventLeft = index * (eventWidth + gap);

                return (
                  <div
                    key={event.id}
                    className="absolute pl-16 pr-4 bg-blue-300 bg-opacity-20 text-black text-xs rounded-lg shadow-lg"
                    style={{
                      top: `${startTop}rem`,
                      height: `${eventHeight}rem`,
                      width: `${eventWidth}%`,
                      left: `${eventLeft}%`,
                    }}
                  >
                    <div className="px-2 py-1">
                      <div className="font-semibold">{event.title}</div>
                      <div>
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>
                );
              });
            })}
            {isToday && (
              <div
                className="absolute left-16 right-2 w-full border-t-2 border-red-500"
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
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default DayCalendar;
