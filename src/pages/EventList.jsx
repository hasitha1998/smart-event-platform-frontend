import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import SearchFilter from "../components/SearchFilter";
import { useAuth } from "../context/AuthContext";

export default function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "", city: "" });

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.city) params.city = filters.city;

      const { data } = await api.get("/events", { params });
      setEvents(data.events);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchEvents(1), 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [fetchEvents]);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    api.get("/events/bookmarks/me").then(({ data }) => setBookmarks(data.map((e) => e._id)));
  }, [user]);

  const toggleBookmark = async (eventId) => {
    if (!user) return;
    const { data } = await api.post(`/events/${eventId}/bookmark`);
    setBookmarks(data.bookmarks);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-paper">Discover tech events</h1>
        <p className="text-muted mt-1">
          Conferences, meetups and hackathons happening near you and online.
        </p>
      </div>

      <SearchFilter filters={filters} onChange={setFilters} />

      {loading ? (
        <p className="text-muted text-center py-16">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-muted text-center py-16">No events match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isBookmarked={bookmarks.includes(event._id)}
              onToggleBookmark={user ? toggleBookmark : undefined}
            />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchEvents(p)}
              className={`w-8 h-8 rounded-sm text-sm ${
                p === pagination.page ? "bg-signal text-ink" : "bg-surface2 text-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
