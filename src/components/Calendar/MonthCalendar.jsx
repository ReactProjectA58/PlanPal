import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RecurringEvents from "../Events/RecurringEvents";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfDay,
  sub,
} from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faBook,
  faFilm,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MonthCalendar({ onDateClick, events }) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  useEffect(() => {
    setCurrentMonth(format(selectedDay, "MMM-yyyy"));
  }, [selectedDay]);

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    onDateClick(day);
  };

  const getEventsForDay = (day) => {
    const recurringEventsForSelectedDay = RecurringEvents({ events, selectedDate: day });
    const eventsForSelectedDay = events.filter((event) =>
      isEqual(startOfDay(parse(event.startDate, "yyyy-MM-dd", new Date())), startOfDay(day))
    );

    const allEventsForSelectedDay = [
      ...eventsForSelectedDay,
      ...recurringEventsForSelectedDay,
    ];

    return allEventsForSelectedDay;
  };

  const getEventIcon = (category) => {
    const iconMap = {
      Sports: faFutbol,
      "Culture & Science": faBook,
      Entertainment: faFilm,
    };
    return iconMap[category] || faEllipsisH;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Sports: "rgba(0, 128, 0, 0.4)",
      "Culture & Science": "rgba(0, 0, 255, 0.4)",
      Entertainment: "rgba(255, 255, 0, 0.4)",
    };
    return colorMap[category] || "rgba(128, 128, 128, 0.4)";
  };

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const startDayOfWeek = (getDay(firstDayCurrentMonth) + 6) % 7; // Adjust to start week on Monday
  const blankDays = Array.from({ length: startDayOfWeek }).map((_, index) => (
    <div key={`blank-${index}`} className="py-1.5 relative h-auto"></div>
  ));

  return (
    <div className="pt-16" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
      <div className="max-w-full h-full px-2 sm:px-4 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={previousMonth}
            className="flex items-center justify-center p-2 text-400 hover:text-500"
          >
            <span className="sr-only">Previous month</span>
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
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="flex items-center justify-center p-2 text-400 hover:text-500"
          >
            <span className="sr-only">Next month</span>
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
        <div className="grid grid-cols-7 gap-2 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={index} className="text-xl font-semibold">
              {day}
            </div>
          ))}
          {blankDays}
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5 relative h-auto"
              )}
            >
              <button
                type="button"
                className={classNames(
                  isEqual(day, selectedDay) && "text-red-500 font-semibold",
                  !isEqual(day, selectedDay) && isToday(day) && "text-red-500 font-semibold",
                  !isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && "text-900",
                  !isEqual(day, selectedDay) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && "text-400",
                  "mx-auto flex flex-col items-center justify-start w-full h-full"
                )}
                onClick={() => handleDayClick(day)}
              >
                <time dateTime={format(day, "yyyy-MM-dd")} className="flex items-center justify-center w-full mb-1">
                  {format(day, "d")}
                </time>
                <div className="w-full border-t mb-1 pb-4"></div>
                <div className="flex justify-center items-center">
                  {getEventsForDay(day).map((event, index) => (
                    <FontAwesomeIcon
                      key={index}
                      icon={getEventIcon(event.category)}
                      style={{ color: getCategoryColor(event.category) }}
                      className="text-lg mx-1"
                    />
                  ))}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

MonthCalendar.propTypes = {
  onDateClick: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
};

const colStartClasses = [
  "",
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
];
