import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EventMap from "../components/EventMap";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lon } resolved for the map
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => setEvent(data));
  }, [id]);

  useEffect(() => {
    if (!event || event.isOnline) return;
    api
      .get(`/events/${id}/weather`)
      .then(({ data }) => {
        setWeather(data.weather);
        if (data.location?.lat && data.location?.lon) {
          setCoords({ lat: data.location.lat, lon: data.location.lon });
        }
      })
      .catch(() => setWeatherError("Weather data is currently unavailable for this location."));
  }, [event, id]);

  useEffect(() => {
    if (!user) return;
    api.get("/events/bookmarks/me").then(({ data }) => {
      setIsBookmarked(data.some((e) => e._id === id));
    });
  }, [user, id]);

  const toggleBookmark = async () => {
    if (!user) return navigate("/login");
    const { data } = await api.post(`/events/${id}/bookmark`);
    setIsBookmarked(data.bookmarked);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    navigate("/");
  };

  if (!event) return <p className="text-center py-20 text-muted">Loading...</p>;

  const isOwner = user && event.organizer?._id === user.id;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-muted hover:text-pulse">
        ← Back to events
      </Link>

      <div className="card p-8 mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-pulse border border-pulse/40 rounded-sm px-2 py-0.5">
              {event.category}
            </span>
            <h1 className="text-2xl font-bold text-paper mt-3">{event.title}</h1>
          </div>
          <button
            onClick={toggleBookmark}
            className={`text-2xl leading-none ${isBookmarked ? "text-signal" : "text-muted hover:text-signal"}`}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        </div>

        <p className="text-muted mt-4 leading-relaxed">{event.description}</p>

        <dl className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div>
            <dt className="text-muted">Date</dt>
            <dd className="text-paper">{new Date(event.date).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted">Location</dt>
            <dd className="text-paper">
              {event.isOnline
                ? "Online"
                : event.location?.city
                ? `${event.location.city}, ${event.location.country}`
                : "Location not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Capacity</dt>
            <dd className="text-paper">{event.capacity || "Unlimited"}</dd>
          </div>
          <div>
            <dt className="text-muted">Organizer</dt>
            <dd className="text-paper">{event.organizer?.name}</dd>
          </div>
        </dl>

        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {event.tags.map((tag) => (
              <span key={tag} className="text-xs bg-surface2 text-muted px-2 py-1 rounded-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {!event.isOnline && (
          <div className="mt-8 pt-6 border-t border-line">
            <h2 className="text-sm font-display font-semibold text-paper mb-2">
              Weather forecast for the venue
            </h2>
            {weatherError && <p className="text-sm text-muted">{weatherError}</p>}
            {!weatherError && !weather && <p className="text-sm text-muted">Fetching forecast...</p>}
            {weather && (
              <div className="flex items-center gap-6 text-sm text-paper">
                <span className="text-3xl font-display font-bold text-pulse">
                  {Math.round(weather.current.temperature_2m)}°C
                </span>
                <div>
                  <p>Wind: {weather.current.wind_speed_10m} km/h</p>
                  <p className="text-muted">
                    Today's range: {Math.round(weather.daily.temperature_2m_min[0])}° –{" "}
                    {Math.round(weather.daily.temperature_2m_max[0])}°
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {!event.isOnline && coords && (
          <div className="mt-8 pt-6 border-t border-line">
            <h2 className="text-sm font-display font-semibold text-paper mb-2">Venue location</h2>
            <EventMap
              lat={coords.lat}
              lon={coords.lon}
              label={`${event.location?.city || event.title}, ${event.location?.country || ""}`}
            />
          </div>
        )}

        {isOwner && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-line">
            <Link to={`/events/${id}/edit`} className="btn-secondary">
              Edit event
            </Link>
            <button onClick={handleDelete} className="btn-secondary hover:border-red-400">
              Delete event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}