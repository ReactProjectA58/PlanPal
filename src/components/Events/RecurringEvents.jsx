import {
  addWeeks,
  addMonths,
  addYears,
  parseISO,
  differenceInMinutes,
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfDay,
  startOfWeek,
  addMinutes,
  format,
} from "date-fns";
import PropTypes from "prop-types";

const RecurringEvents = ({ events, selectedDate }) => {
  const recurringEvents = [];

  events.forEach((event) => {
    if (event.isReoccurring) {
      const originalEventStart = parseISO(`${event.startDate}T${event.startTime}`);
      const originalEventEnd = parseISO(`${event.endDate}T${event.endTime}`);
      const eventDuration = differenceInMinutes(originalEventEnd, originalEventStart);
      const finalDate = event.finalDate ? parseISO(event.finalDate) : null;

      let eventStart = originalEventStart;
      let eventEnd = originalEventEnd;

      const addRecurrence = () => {
        recurringEvents.push({
          ...event,
          startDate: format(eventStart, "yyyy-MM-dd"),
          endDate: format(eventEnd, "yyyy-MM-dd"),
          startTime: format(eventStart, "HH:mm"),
          endTime: format(eventEnd, "HH:mm"),
        });
      };

      const calculateNextOccurrence = (unit) => {
        switch (unit) {
          case "weekly":
            eventStart = addWeeks(eventStart, 1);
            break;
          case "monthly":
            eventStart = addMonths(eventStart, 1);
            break;
          case "yearly":
            eventStart = addYears(eventStart, 1);
            break;
          default:
            break;
        }
        eventEnd = addMinutes(eventStart, eventDuration);
      };

      const shouldAddEvent = () => {
        return (
          eventStart <= endOfDay(selectedDate) &&
          eventEnd >= startOfDay(selectedDate) &&
          (!finalDate || eventStart <= finalDate)
        );
      };

      switch (event.isReoccurring) {
        case "weekly":
          while (eventStart < startOfWeek(selectedDate)) {
            calculateNextOccurrence("weekly");
            if (finalDate && eventStart > finalDate) break;
          }
          if (shouldAddEvent() && eventStart.getTime() !== originalEventStart.getTime()) {
            addRecurrence();
          }
          break;
        case "monthly":
          while (eventStart < startOfMonth(selectedDate)) {
            calculateNextOccurrence("monthly");
            if (finalDate && eventStart > finalDate) break;
          }
          if (shouldAddEvent() && eventStart.getTime() !== originalEventStart.getTime()) {
            addRecurrence();
          }
          break;
        case "yearly":
          while (eventStart < startOfYear(selectedDate)) {
            calculateNextOccurrence("yearly");
            if (finalDate && eventStart > finalDate) break;
          }
          if (shouldAddEvent() && eventStart.getTime() !== originalEventStart.getTime()) {
            addRecurrence();
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
