import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { logout as authLogout } from "../services/authService";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click (HOOK MUST ALWAYS RUN)
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Hide navbar on auth / landing pages
  const hideNavbarRoutes = ["/", "/login", "/signup", "/forgot-password"];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const logout = async () => {
    try {
      await authLogout();
      setOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="card" style={{ marginBottom: "20px" }}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>QuizMaster</h2>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link to="/home">Home</Link>

          {user && role === "user" && (
            <>
              <Link to="/quizzes">Quizzes</Link>
              <Link to="/dashboard">Dashboard</Link>
            </>
          )}

          {user && role === "admin" && (
            <>
              <Link to="/admin/dashboard">Admin</Link>
              <Link to="/admin/quizzes">Manage Quizzes</Link>
            </>
          )}

          {user && (
            <div className="account-wrapper" ref={dropdownRef}>
              <button className="btn-icon" onClick={() => setOpen(!open)}>
                👤
              </button>

              {open && (
                <div className="dropdown">
                  <Link to="/account" onClick={() => setOpen(false)}>
                    My Account
                  </Link>

                  {role === "admin" && (
                    <>
                      <Link
                        to="/admin/create-quiz"
                        onClick={() => setOpen(false)}
                      >
                        Add Quiz
                      </Link>
                      <Link to="/admin/quizzes" onClick={() => setOpen(false)}>
                        Manage Quizzes
                      </Link>
                    </>
                  )}

                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}

          <button className="btn-icon" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}
