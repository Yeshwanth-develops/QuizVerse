import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [psid, setPsid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await signup(psid, name, email, password);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <h2>Create Account</h2>

        <input
          placeholder="PSID (5-digit)"
          value={psid}
          onChange={(e) => setPsid(e.target.value)}
        />

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginTop: "12px" }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginTop: "12px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: "12px" }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleSignup}
          disabled={loading}
          style={{ width: "100%", marginTop: "15px" }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
