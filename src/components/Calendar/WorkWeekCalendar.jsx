import PropTypes from "prop-types";
import WeekCalendar from "./WeekCalendar";

function WorkWeekCalendar({ events, onDateClick }) {
  const workWeekEvents = events.filter(event => {
    const dayOfWeek = new Date(event.startDate).getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; 
  });

  return (
    <div style={{ width: "100%" }}>
      <WeekCalendar events={workWeekEvents} onDateClick={onDateClick} isInWeekView={true} />
    </div>
  );
}

WorkWeekCalendar.propTypes = {
  events: PropTypes.array.isRequired,
  onDateClick: PropTypes.func.isRequired,
};

export default WorkWeekCalendar;
