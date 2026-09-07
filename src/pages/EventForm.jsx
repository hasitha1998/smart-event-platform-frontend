import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const EMPTY = {
  title: "",
  description: "",
  category: "Meetup",
  date: "",
  isOnline: false,
  city: "",
  country: "",
  tags: "",
  capacity: "",
};

export default function EventForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/events/${id}`).then(({ data }) => {
      setForm({
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date.slice(0, 16),
        isOnline: data.isOnline,
        city: data.location?.city || "",
        country: data.location?.country || "",
        tags: (data.tags || []).join(", "),
        capacity: data.capacity || "",
      });
    });
  }, [id]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      date: form.date,
      isOnline: form.isOnline,
      location: form.isOnline
        ? { city: "Online", country: "Online" }
        : { city: form.city, country: form.country },
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      capacity: Number(form.capacity) || 0,
    };

    try {
      if (id) {
        await api.put(`/events/${id}`, payload);
        navigate(`/events/${id}`);
      } else {
        const { data } = await api.post("/events", payload);
        navigate(`/events/${data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-paper mb-6">
        {id ? "Edit event" : "Host a new event"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="input"
          placeholder="Event title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
        <textarea
          className="input min-h-[100px]"
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            className="input"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {["Conference", "Meetup", "Hackathon", "Webinar", "Workshop", "Other"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="datetime-local"
            required
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.isOnline}
            onChange={(e) => update("isOnline", e.target.checked)}
          />
          This is an online event
        </label>

        {!form.isOnline && (
          <div className="grid grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="City"
              required={!form.isOnline}
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
            <input
              className="input"
              placeholder="Country"
              required={!form.isOnline}
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => update("capacity", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : id ? "Save changes" : "Create event"}
        </button>
      </form>
    </div>
  );
}
