import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-line bg-surface/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="font-display text-xl font-bold text-paper">Pulse</span>
          <span className="text-signal font-display text-xl font-bold">.</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-muted hover:text-paper transition-colors">
            Browse events
          </Link>
          {user && (
            <>
              <Link to="/bookmarks" className="text-muted hover:text-paper transition-colors">
                Saved
              </Link>
              <Link to="/create" className="text-muted hover:text-paper transition-colors">
                Host an event
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-line">
              <span className="text-paper">{user.name}</span>
              <button onClick={handleLogout} className="btn-secondary !py-1.5 !px-3 text-xs">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-3 border-l border-line">
              <Link to="/login" className="text-muted hover:text-paper transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !py-1.5 !px-3 text-xs">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
