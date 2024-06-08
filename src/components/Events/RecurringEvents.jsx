import {
  addWeeks,
  addMonths,
  addYears,
  addMinutes,
  parseISO,
  differenceInMinutes,
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfDay,
  startOfWeek,
} from "date-fns";
import PropTypes from 'prop-types';

const RecurringEvents = ({ events, selectedDate }) => {
  const recurringEvents = [];

  events.forEach((event) => {
    if (event.isReoccurring) {
      let eventStart = parseISO(`${event.startDate}T${event.startTime}`);
      let eventEnd = parseISO(`${event.endDate}T${event.endTime}`);
      const eventDuration = differenceInMinutes(eventEnd, eventStart);
      const finalDate = event.finalDate ? parseISO(event.finalDate) : null;

      switch (event.isReoccurring) {
        case "weekly":
          while (eventStart < startOfWeek(selectedDate)) {
            eventStart = addWeeks(eventStart, 1);
            eventEnd = addMinutes(eventStart, eventDuration);
            if (finalDate && eventStart > finalDate) break;
          }
          if (
            eventStart <= endOfDay(selectedDate) &&
            eventEnd >= startOfDay(selectedDate) &&
            (!finalDate || eventStart <= finalDate)
          ) {
            recurringEvents.push({
              ...event,
              startDate: eventStart.toISOString().split("T")[0],
              endDate: eventEnd.toISOString().split("T")[0],
            });
          }
          break;
        case "monthly":
          while (eventStart < startOfMonth(selectedDate)) {
            eventStart = addMonths(eventStart, 1);
            eventEnd = addMinutes(eventStart, eventDuration);
            if (finalDate && eventStart > finalDate) break;
          }
          if (
            eventStart <= endOfDay(selectedDate) &&
            eventEnd >= startOfDay(selectedDate) &&
            (!finalDate || eventStart <= finalDate)
          ) {
            recurringEvents.push({
              ...event,
              startDate: eventStart.toISOString().split("T")[0],
              endDate: eventEnd.toISOString().split("T")[0],
            });
          }
          break;
        case "yearly":
          while (eventStart < startOfYear(selectedDate)) {
            eventStart = addYears(eventStart, 1);
            eventEnd = addMinutes(eventStart, eventDuration);
            if (finalDate && eventStart > finalDate) break;
          }
          if (
            eventStart <= endOfDay(selectedDate) &&
            eventEnd >= startOfDay(selectedDate) &&
            (!finalDate || eventStart <= finalDate)
          ) {
            recurringEvents.push({
              ...event,
              startDate: eventStart.toISOString().split("T")[0],
              endDate: eventEnd.toISOString().split("T")[0],
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

RecurringEvents.propTypes = {
  events: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

export default RecurringEvents;
