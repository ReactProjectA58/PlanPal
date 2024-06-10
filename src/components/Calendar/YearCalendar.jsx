import { useState } from "react";
import PropTypes from "prop-types";
import {
  add,
  format,
  getDay,
  parse,
  startOfMonth,
  getDaysInMonth,
  sub,
  startOfToday,
} from "date-fns";
import RecurringEvents from "../Events/RecurringEvents";

export default function YearCalendar({ onDateClick, events }) {
  const today = startOfToday();
  const [currentYear, setCurrentYear] = useState(format(today, "yyyy"));

  const startOfCurrentYear = parse(currentYear, "yyyy", new Date());

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthStart = add(startOfCurrentYear, { months: i });
    const daysInMonth = getDaysInMonth(monthStart);
    const firstDayOfWeek = (getDay(startOfMonth(monthStart)) + 6) % 7;
    const monthDays = Array.from(
      { length: daysInMonth + firstDayOfWeek },
      (_, i) => {
        const day = add(startOfMonth(monthStart), { days: i - firstDayOfWeek });
        const eventsForDay = events.filter(
          (event) =>
            format(event.startDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );
        const recurringEventsForDay = RecurringEvents({
          events,
          selectedDate: day,
        });
        const hasEvents =
          eventsForDay.length > 0 || recurringEventsForDay.length > 0;

        if (hasEvents) {
          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex justify-center items-center ${
                i >= firstDayOfWeek
                  ? "text-gray-700 cursor-pointer"
                  : "bg-transparent"
              }`}
              onClick={() => i >= firstDayOfWeek && onDateClick(day)}
              style={
                i >= firstDayOfWeek
                  ? {
                      backgroundColor: "red",
                      opacity: 0.4,
                      color: "white",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                    }
                  : {}
              }
            >
              {i >= firstDayOfWeek ? format(day, "d") : ""}
            </div>
          );
        } else {
          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex justify-center items-center ${
                i >= firstDayOfWeek
                  ? "text-gray-700 cursor-pointer"
                  : "bg-transparent"
              }`}
              onClick={() => i >= firstDayOfWeek && onDateClick(day)}
            >
              {i >= firstDayOfWeek ? format(day, "d") : ""}
            </div>
          );
        }
      }
    );

    return (
      <div key={format(monthStart, "MMM-yyyy")}>
        <div className="text-lg font-semibold mb-2">
          {format(monthStart, "MMMM")}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={index} className="text-sm font-semibold text-center">
              {day}
            </div>
          ))}
          {monthDays}
        </div>
      </div>
    );
  });

  function previousYear() {
    const firstDayPreviousYear = sub(startOfCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayPreviousYear, "yyyy"));
  }

  function nextYear() {
    const firstDayNextYear = add(startOfCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  return (
    <div className="pt-16" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
        <div className="max-w-full h-full px-2 sm:px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    type="button"
                    onClick={previousYear}
                    className="flex items-center justify-center p-2 text-400 hover:text-500"
                >
                    <span className="sr-only">Previous year</span>
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
                <h2 className="text-lg font-semibold">{currentYear}</h2>
                <button
                    type="button"
                    onClick={nextYear}
                    className="flex items-center justify-center p-2 text-400 hover:text-500"
                >
                    <span className="sr-only">Next year</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {months}
            </div>
        </div>
    </div>
);

}

YearCalendar.propTypes = {
  onDateClick: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
};
