import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

export default function Bookmarks() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/events/bookmarks/me").then(({ data }) => setEvents(data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const toggleBookmark = async (eventId) => {
    await api.post(`/events/${eventId}/bookmark`);
    setEvents((prev) => prev.filter((e) => e._id !== eventId));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-paper mb-8">Saved events</h1>

      {loading ? (
        <p className="text-muted text-center py-16">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-muted text-center py-16">
          You haven't bookmarked any events yet. Browse events and tap the star to save one.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} isBookmarked onToggleBookmark={toggleBookmark} />
          ))}
        </div>
      )}
    </div>
  );
}
