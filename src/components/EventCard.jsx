import { Link } from "react-router-dom";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function EventCard({ event, isBookmarked, onToggleBookmark }) {
  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-pulse/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-pulse border border-pulse/40 rounded-sm px-2 py-0.5">
          {event.category}
        </span>
        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(event._id)}
            aria-label={isBookmarked ? "Remove bookmark" : "Save event"}
            className={`text-lg leading-none ${isBookmarked ? "text-signal" : "text-muted hover:text-signal"}`}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        )}
      </div>

      <Link to={`/events/${event._id}`}>
        <h3 className="text-lg font-semibold text-paper hover:text-pulse transition-colors">
          {event.title}
        </h3>
      </Link>

      <p className="text-sm text-muted line-clamp-2">{event.description}</p>

      <div className="flex items-center justify-between text-sm text-muted pt-2 border-t border-line">
        <span>{formatDate(event.date)}</span>
        <span>{event.isOnline ? "Online" : event.location?.city}</span>
      </div>
    </div>
  );
}
