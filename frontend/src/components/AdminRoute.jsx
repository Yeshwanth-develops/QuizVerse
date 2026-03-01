import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  // ⏳ WAIT
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Not admin
  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
