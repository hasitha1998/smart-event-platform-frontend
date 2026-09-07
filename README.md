# Pulse — Frontend

React + Vite single-page app for the Smart Event Management Platform. Lets users browse, search, and filter events, view details with a live venue weather forecast, log in/register, bookmark events, and create/edit their own events.

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- **HTTP client:** Axios (with a request interceptor for JWT auth)
- **State management:** React Context (`AuthContext`) for auth; local component state for page data

## Folder Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance, base URL + auth header interceptor
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state: user, login, register, logout
│   ├── components/
│   │   ├── Navbar.jsx             # Top nav, shows auth state
│   │   ├── EventCard.jsx          # Event summary card with bookmark toggle
│   │   ├── SearchFilter.jsx       # Search box + category/city filters
│   │   └── ProtectedRoute.jsx     # Redirects to /login if not authenticated
│   ├── pages/
│   │   ├── EventList.jsx          # Home — browse/search/filter/paginate events
│   │   ├── EventDetail.jsx        # Event details + live weather widget
│   │   ├── EventForm.jsx          # Create and edit event (same component, both modes)
│   │   ├── Bookmarks.jsx          # Current user's saved events
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx                    # Route definitions
│   ├── main.jsx                   # React entry point, providers (Router, AuthProvider)
│   └── index.css                  # Tailwind directives + shared component classes
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm
- The backend API running (see `backend/README.md`) — defaults to `http://localhost:5000`

### Installation

```bash
cd frontend
npm install
cp .env.example .env      # defaults to http://localhost:5000/api
npm run dev                 # starts app on http://localhost:5173
```

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`) |

### Run Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Pages & Routes

| Route | Component | Auth required | Description |
|---|---|---|---|
| `/` | `EventList` | No | Browse events with search/category/city filters and pagination |
| `/events/:id` | `EventDetail` | No | Event details + live weather forecast for in-person events |
| `/login` | `Login` | No | Log in, redirects home on success |
| `/register` | `Register` | No | Create account, redirects home on success |
| `/create` | `EventForm` | Yes | Create a new event |
| `/events/:id/edit` | `EventForm` | Yes (owner) | Edit an existing event |
| `/bookmarks` | `Bookmarks` | Yes | List the current user's saved events |

## Architecture Decisions

**Tech choices** — Vite for a fast dev server and minimal config compared to CRA/webpack. Tailwind for utility-first styling that keeps design decisions co-located with markup instead of a separate CSS architecture, using a small custom token set (`ink`, `surface`, `signal`, `pulse`, etc. in `tailwind.config.js`) rather than default Tailwind colors, to give the app its own visual identity.

**Folder structure** — `pages/` holds route-level components; `components/` holds anything reused across more than one page. `api/axios.js` centralizes the base URL and auth header logic so no component talks to `fetch`/environment variables directly.

**State management** — No Redux/Zustand. The only truly global piece of state is "who is logged in," which fits a single React Context (`AuthContext`) cleanly. Everything else (event lists, filters, form state) is local `useState`/`useEffect` per page, which keeps pages independent and easy to reason about at this app's size.

**Authentication** — JWT is stored in `localStorage` and attached to every request via an Axios request interceptor, rather than passing tokens through props or context on every call. `ProtectedRoute` wraps any route needing a logged-in user and redirects to `/login` otherwise. Trade-off: `localStorage` is more XSS-exposed than an HTTP-only cookie — acceptable for this assignment's scope, called out in Future Improvements.

**Tradeoffs / Assumptions**
- Search is debounced client-side with a plain `setTimeout` rather than a dedicated hook/library.
- No client-side form validation library (e.g. React Hook Form + Zod) — relies on native HTML `required`/`minLength` plus server-side validation.
- No global toast/notification system; errors are shown inline per form.
- Weather widget assumes an in-person event always has a resolvable city/country; no manual coordinate override in the UI.

## Future Improvements

**Features:** image upload for event covers, infinite scroll as an alternative to numbered pagination, a proper toast notification system, dark/light theme toggle, calendar (.ics) export button on event detail.

**Performance/Scalability:** code-splitting routes with `React.lazy`, caching event list responses (e.g. React Query/TanStack Query) instead of refetching on every filter change, virtualized lists for very large result sets.

**Security:** move JWT storage from `localStorage` to an HTTP-only cookie set by the backend to reduce XSS exposure, add CSRF protection if cookies are adopted, sanitize/escape any user-generated text (event descriptions, tags) before rendering.

git add frontend/package.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/.env.example frontend/index.html frontend/src/index.css
git commit -m "feat(frontend): scaffold Vite + React app with Tailwind design tokens