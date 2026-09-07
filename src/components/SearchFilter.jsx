const CATEGORIES = ["", "Conference", "Meetup", "Hackathon", "Webinar", "Workshop", "Other"];

export default function SearchFilter({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
      <input
        className="input sm:col-span-2"
        placeholder="Search events by title, tag..."
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
      />
      <select
        className="input"
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c || "All categories"}
          </option>
        ))}
      </select>
      <input
        className="input"
        placeholder="City"
        value={filters.city}
        onChange={(e) => update("city", e.target.value)}
      />
    </div>
  );
}
