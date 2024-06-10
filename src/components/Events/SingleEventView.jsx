import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { getEventById } from '../../services/event.service.js';
import { AppContext } from '../../context/AppContext.jsx';
import { GoBackArrow, Edit } from '../../common/helpers/icons.jsx';
import { EVENT_COVER_BY_DEFAULT } from '../../common/constants.js';
import Map from './Map.jsx';
import './styles.css';

export default function SingleEventView() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const participantsRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        setError('Failed to fetch event data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (participantsRef.current && !participantsRef.current.contains(event.target)) {
        participantsRef.current.removeAttribute("open");
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [participantsRef]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!event) return <div className="text-center mt-10">No event found.</div>;

  return (
    <div className="single-event-container px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <div className="flex items-center space-x-2">
          <GoBackArrow onClick={() => navigate("/events")} />
          {userData?.handle === event.creator && (
            <Edit onClick={() => navigate(`/update-event/${eventId}`)} />
          )}
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Creator:</span> {event.creator}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Start Time:</span> {event.startDate} {event.startTime}
      </div>
      <div className="mb-4">
        <span className="font-semibold">End Time:</span> {event.endDate} {event.endTime}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Address:</span> {event.location}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Category:</span> {event.category}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Description:</span> {event.description}
      </div>
      <div className="mb-4 flex">
        <div className="flex-grow mr-2 flex justify-center items-center">
          <img src={event.cover || EVENT_COVER_BY_DEFAULT} alt="Event" className="rounded-xl max-h-96 object-contain w-full h-full" />
        </div>
        <div className="flex-grow ml-2">
          <Map address={event.location} className="w-full h-96" />
        </div>
      </div>
      <div className="mb-4 relative" ref={participantsRef}>
        <details className="dropdown">
          <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">Participants</summary>
          <div
            className="dropdown-menu absolute max-h-48 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black hover:glass"
            style={{ zIndex: 999 }}
          >
            <ul className="space-y-2">
              {event.peopleGoing ? Object.entries(event.peopleGoing).map(([participant, participantData], index) => (
                <li key={participant} className={`flex items-center space-x-3 ${index % 3 === 0 && 'mt-4'}`}>
                  <img src={participantData.avatar || "https://via.placeholder.com/40"} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold">{participantData.name || participant}</div>
                    <div className="text-sm text-gray-600">@{participant}</div>
                  </div>
                </li>
              )) : (
                <li>No participants yet.</li>
              )}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
