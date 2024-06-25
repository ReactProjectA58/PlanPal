import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  isBefore,
  isSameDay,
} from "date-fns";
import RecurringEvents from "../Events/RecurringEvents";

function WeekCalendar({ events = [], onDateClick = () => {}, isInWeekView = false }) {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
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

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => add(selectedWeek, { days: i }));

  const currentHour = getHours(currentTime);
  const currentMinute = getMinutes(currentTime);
  const isCurrentWeek = format(startOfWeek(currentTime, { weekStartsOn: 1 }), "yyyy-MM-dd") === format(selectedWeek, "yyyy-MM-dd");
  const currentTimePosition = (currentHour + currentMinute / 60) * 3;

  const hours = Array.from({ length: 24 }, (_, i) => setHours(startOfDay(new Date()), i));

  const getCategoryColor = (category, isPast) => {
    const baseColor =
      {
        Sports: "bg-green-300",
        "Culture & Science": "bg-blue-300",
        Entertainment: "bg-yellow-300",
        default: "bg-gray-300",
      }[category] || "bg-gray-300";

    return `${baseColor} ${isPast ? "bg-opacity-20" : "bg-opacity-50"}`;
  };

  const getEventsForDay = (day) => {
    const recurringEventsForSelectedDay = RecurringEvents({ events, selectedDate: day });
    const eventsForSelectedDay = events.filter((event) => isSameDay(parseISO(event.startDate), day));
    return [...eventsForSelectedDay, ...recurringEventsForSelectedDay];
  };

  const isOverlapping = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
  };

  const groupEvents = (dayEvents) => {
    const columns = [];
    dayEvents.forEach((event) => {
      const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
      const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].some((colEvent) => isOverlapping(eventStart, eventEnd, parseISO(`${colEvent.startDate}T${colEvent.startTime}`), parseISO(`${colEvent.endDate}T${colEvent.endTime}`)))) {
          columns[i].push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    });
    return columns;
  };

  return (
    <div className="pt-16" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
      <div className="px-4 mx-auto sm:px-7 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <button type="button" onClick={previousWeek} className="flex items-center justify-center p-2 text-400 hover:text-500">
            <span className="sr-only">Previous week</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">
            {format(selectedWeek, "MMMM d")} - {format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "MMMM d, yyyy")}
          </h2>
          <button type="button" onClick={nextWeek} className="flex items-center justify-center p-2 text-400 hover:text-500">
            <span className="sr-only">Next week</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="relative border w-full">
          <div className={`grid ${isInWeekView ? 'grid-cols-6' : 'grid-cols-8'}`}>
            <div className="border-r w-full">
              <div className="h-12 flex flex-col items-center justify-center border-b glass py-2">
                <h3 className="text-sm">Hours</h3>
              </div>
              {hours.map((hour, index) => (
                <div key={index} className="h-12 flex items-center justify-center border-b">
                  <div className="w-16 text-right pr-2 text-xs">{format(hour, "HH:mm")}</div>
                </div>
              ))}
            </div>
            {daysOfWeek
              .filter((_, index) => !isInWeekView || (index !== 5 && index !== 6))
              .map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day);
                const groupedEvents = groupEvents(dayEvents);
                const maxColumns = groupedEvents.length;
                return (
                  <div key={dayIndex} className="relative border-r w-full cursor-pointer" onClick={() => onDateClick(day)}>
                    <div className="flex flex-col items-center justify-center border-b glass py-2 h-12">
                      <h3 className="text-sm">{format(day, "EEE, MMM d")}</h3>
                    </div>
                    <div className="relative">
                      {hours.map((hour, index) => (
                        <div key={index} className="h-12 border-b"></div>
                      ))}
                      {groupedEvents.map((eventsInColumn, columnIndex) => 
                        eventsInColumn.map((event, index) => {
                          const eventStart = parseISO(`${event.startDate}T${event.startTime}`);
                          const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);

                          const dayStart = startOfDay(day);
                          const dayEnd = endOfDay(day);

                          const actualStart = eventStart < dayStart ? dayStart : eventStart;
                          const actualEnd = eventEnd > dayEnd ? dayEnd : eventEnd;

                          const eventStartHour = getHours(actualStart);
                          const eventStartMinute = getMinutes(actualStart);
                          const startTop = (eventStartHour + eventStartMinute / 60) * 3;
                          const eventHeight = (differenceInMinutes(actualEnd, actualStart) / 60) * 3;
                          const isPast = isBefore(actualEnd, currentTime);
                          const eventColor = getCategoryColor(event.category, isPast);

                          const eventWidth = `${100 / maxColumns}%`;
                          const eventLeft = `${columnIndex * (100 / maxColumns)}%`;

                          return (
                            <div
                              key={index}
                              className={`absolute text-white text-xs rounded px-1 py-0.5 ${eventColor}`}
                              style={{
                                top: `${startTop}rem`,
                                height: `${eventHeight}rem`,
                                width: eventWidth,
                                left: eventLeft,
                              }}
                            >
                              <div className="px-2 py-1">
                                <div>{event.title}</div>
                                <div>{event.startTime} - {event.endTime}</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      {isCurrentWeek && format(currentTime, "yyyy-MM-dd") === format(day, "yyyy-MM-dd") && (
                        <div className="absolute left-0 right-0 mx-1 border-t-2 border-red-500" style={{ top: `${currentTimePosition}rem` }}>
                          <div className="absolute left-0 -mt-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

WeekCalendar.propTypes = {
  events: PropTypes.array,
  onDateClick: PropTypes.func,
  isInWeekView: PropTypes.bool,
};

export default WeekCalendar;
