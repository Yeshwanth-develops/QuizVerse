import { useEffect, useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [psid, setPsid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(psid, password);
      // ❗ DO NOT navigate here
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect ONLY after auth state is ready
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [user, role, authLoading, navigate]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ width: "400px" }}>
        <h2 style={{ marginBottom: "15px" }}>Login</h2>

        <input
          placeholder="PSID"
          value={psid}
          onChange={(e) => setPsid(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: "12px" }}
        />

        <div style={{ textAlign: "right", marginTop: "8px" }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: "13px", color: "var(--primary)" }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", marginTop: "15px" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "var(--primary)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
