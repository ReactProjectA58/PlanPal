import {
  format,
  add,
  sub,
  startOfDay,
  endOfDay,
  setHours,
  getHours,
  getMinutes,
  parseISO,
  differenceInMinutes,
  isSameDay,
  isSameMonth,
  isSameYear,
  addWeeks,
  addMonths,
  addYears,
  addMinutes,
  startOfMonth,
  startOfYear
} from "date-fns";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function DayCalendar({ events, selectedDate, onDateChange }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const GAP_SIZE = 0.5; 

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

  const handleRecurringEvents = () => {
    const recurringEvents = [];

    events.forEach((event) => {
      if (event.isReoccurring) {
        let eventStart = parseISO(`${event.startDate}T${event.startTime}`);
        let eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
        const eventDuration = differenceInMinutes(eventEnd, eventStart);

        switch (event.isReoccurring) {
          case "weekly":
            while (eventStart < startOfDay(selectedDate)) {
              eventStart = addWeeks(eventStart, 1);
              eventEnd = addMinutes(eventStart, eventDuration);
            }
            if (isSameDay(eventStart, selectedDate)) {
              recurringEvents.push({
                ...event,
                startDate: format(eventStart, "yyyy-MM-dd"),
                endDate: format(eventEnd, "yyyy-MM-dd"),
              });
            }
            break;
          case "monthly":
            while (eventStart < startOfDay(selectedDate)) {
              eventStart = addMonths(eventStart, 1);
              eventEnd = addMinutes(eventStart, eventDuration);
            }
            if (isSameDay(eventStart, selectedDate)) {
              recurringEvents.push({
                ...event,
                startDate: format(eventStart, "yyyy-MM-dd"),
                endDate: format(eventEnd, "yyyy-MM-dd"),
              });
            }
            break;
          case "yearly":
            while (eventStart < startOfDay(selectedDate)) {
              eventStart = addYears(eventStart, 1);
              eventEnd = addMinutes(eventStart, eventDuration);
            }
            if (isSameDay(eventStart, selectedDate)) {
              recurringEvents.push({
                ...event,
                startDate: format(eventStart, "yyyy-MM-dd"),
                endDate: format(eventEnd, "yyyy-MM-dd"),
              });
            }
            break;
          default:
            break;
        }
      }
    });

    return recurringEvents;
  };

  const recurringEventsForSelectedDay = handleRecurringEvents();

  const eventsForSelectedDay = events.filter((event) => {
    const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
    const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
    return (
      (format(eventStart, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) ||
      (format(eventEnd, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) ||
      (eventStart < startOfDay(selectedDate) && eventEnd > endOfDay(selectedDate))
    );
  });

  const allEventsForSelectedDay = [
    ...eventsForSelectedDay.filter((event) => {
      return !recurringEventsForSelectedDay.some((recurringEvent) => {
        return recurringEvent.eventId === event.eventId;
      });
    }),
    ...recurringEventsForSelectedDay,
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case "Sports":
        return "bg-green-300 bg-opacity-20";
      case "Culture & Science":
        return "bg-blue-300 bg-opacity-20";
      case "Entertainment":
        return "bg-yellow-300 bg-opacity-20";
      default:
        return "bg-gray-300 bg-opacity-20";
    }
  };

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
            {allEventsForSelectedDay.map((event, index) => {
              const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
              const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);

              const eventStartHour = eventStart < startOfDay(selectedDate) ? 0 : getHours(eventStart);
              const eventStartMinute = eventStart < startOfDay(selectedDate) ? 0 : getMinutes(eventStart);
              const startTop = (eventStartHour + eventStartMinute / 60) * 3;

              const eventEndHour = eventEnd > endOfDay(selectedDate) ? 24 : getHours(eventEnd);
              const eventEndMinute = eventEnd > endOfDay(selectedDate) ? 0 : getMinutes(eventEnd);
              const eventHeight = (eventEndHour + eventEndMinute / 60) * 3 - startTop;

              const eventLeft = index * ((100 / allEventsForSelectedDay.length) + GAP_SIZE);
              const eventWidth = (100 / allEventsForSelectedDay.length) - GAP_SIZE;

              const categoryColor = getCategoryColor(event.category);

              return (
                <div
                  key={event.id}
                  className={`absolute pl-16 pr-4 text-black text-xs rounded-lg shadow-lg cursor-pointer ${categoryColor}`}
                  style={{
                    top: `${startTop}rem`,
                    height: `${eventHeight}rem`,
                    width: `${eventWidth}%`,
                    left: `${eventLeft}%`,
                    marginLeft: `${GAP_SIZE / 2}rem`,
                    marginRight: `${GAP_SIZE / 2}rem`,
                  }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="px-2 py-1">
                    <div className="font-semibold">{event.title}</div>
                    <div>
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                </div>
              );
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
