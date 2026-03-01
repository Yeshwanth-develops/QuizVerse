import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { db } from "../services/firebase";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [psid, setPsid] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Load User ---------------- */

  useEffect(() => {
    const loadUser = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setName(snap.data().name);
        setPsid(snap.data().psid);
      }
    };

    loadUser();
  }, [user]);

  /* ---------------- Save Profile ---------------- */

  const handleSave = async () => {
    try {
      setLoading(true);

      // Update name in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name,
      });

      // Update email (Auth + Firestore)
      if (email !== user.email) {
        await updateEmail(user, email);
        await updateDoc(doc(db, "users", user.uid), { email });
      }

      // Update password (optional)
      if (newPassword.trim()) {
        await updatePassword(user, newPassword);
        setNewPassword("");
      }

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Logout ---------------- */

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "500px" }}>
        <h2>My Account</h2>

        {/* Name */}
        <label style={{ opacity: 0.8 }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "12px" }}
        />

        {/* Email */}
        <label style={{ opacity: 0.8 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "12px" }}
        />

        {/* Password */}
        <label style={{ opacity: 0.8 }}>New Password</label>
        <input
          type="password"
          placeholder="Leave empty to keep same"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        {/* Actions */}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          className="btn"
          onClick={handleLogout}
          style={{ width: "100%", marginTop: "10px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
