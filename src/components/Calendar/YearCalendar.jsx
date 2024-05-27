import { parse, startOfToday, sub, add, format, startOfMonth, getDaysInMonth, getDay } from "date-fns";
import { useState } from "react";

export default function YearCalendar() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentYear, setCurrentYear] = useState(format(today, "yyyy"));

  const startOfCurrentYear = parse(currentYear, "yyyy", new Date());

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthStart = add(startOfCurrentYear, { months: i });
    const daysInMonth = getDaysInMonth(monthStart);
    const firstDayOfWeek = (getDay(startOfMonth(monthStart)) + 6) % 7; 
    const monthDays = Array.from({ length: daysInMonth + firstDayOfWeek }, (_, i) => {
      const day = add(startOfMonth(monthStart), { days: i - firstDayOfWeek });
      return (
        <div
          key={format(day, "yyyy-MM-dd")}
          className={`flex justify-center items-center ${
            i >= firstDayOfWeek ? "text-gray-700" : "bg-transparent"
          }`}
          onClick={() => i >= firstDayOfWeek && setSelectedDay(day)}
        >
          {i >= firstDayOfWeek ? format(day, "d") : ""}
        </div>
      );
    });

    return (
      <div key={format(monthStart, "MMM-yyyy")} >
        <div className="text-lg font-semibold mb-2">{format(monthStart, "MMMM")}</div>
        <div className="grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
            <div key={day} className="text-sm font-semibold text-center">{day}</div>
          ))}
          {monthDays}
        </div>
      </div>
    );
  });

  function previousYear() {
    const firstDayPreviousYear = sub(startOfCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayPreviousYear, "yyyy"));
    setSelectedDay(sub(selectedDay, { years: 1 }));
  }

  function nextYear() {
    const firstDayNextYear = add(startOfCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
    setSelectedDay(add(selectedDay, { years: 1 }));
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl px-4 mx-auto sm:px-7 md:max-w-6xl md:px-6">
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