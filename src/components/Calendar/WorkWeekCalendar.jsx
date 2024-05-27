import { format, add, sub, startOfWeek, endOfWeek, eachDayOfInterval, isWeekend } from 'date-fns';
import { useState } from 'react';

function WorkWeekCalendar() {
  const [selectedDay, setSelectedDay] = useState(new Date());

  function previousWeek() {
    setSelectedDay(sub(selectedDay, { weeks: 1 }));
  }

  function nextWeek() {
    setSelectedDay(add(selectedDay, { weeks: 1 }));
  }

  const startOfCurrentWeek = startOfWeek(selectedDay);
  const endOfCurrentWeek = endOfWeek(selectedDay);
  const daysOfWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek })
    .filter(day => !isWeekend(day)); // Filter out weekend days (Saturday and Sunday)

  return (
    <div className="pt-16">
      <div className="max-w-7xl px-4 mx-auto sm:px-7 md:max-w-6xl md:px-6">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">{format(startOfCurrentWeek, 'MMMM d, yyyy')} - {format(endOfCurrentWeek, 'MMMM d, yyyy')}</h2>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {daysOfWeek.map(day => (
            <div key={day.toString()} className="border p-2 text-center">
              <div className="text-sm font-semibold">{format(day, 'EEEE')}</div>
              <div>{format(day, 'd')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorkWeekCalendar;
