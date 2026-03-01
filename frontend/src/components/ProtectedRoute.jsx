import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ WAIT for Firebase
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
