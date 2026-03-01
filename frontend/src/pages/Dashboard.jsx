import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchResults = async () => {
      try {
        const q = query(
          collection(db, "attempts"), // ✅ FIXED
          where("userId", "==", user.uid),
        );

        const snap = await getDocs(q);
        setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;
  }

  const totalAttempts = results.length;
  const avgScore =
    totalAttempts === 0
      ? 0
      : Math.round(
          results.reduce((a, b) => a + b.percentage, 0) / totalAttempts,
        );

  const bestScore =
    totalAttempts === 0 ? 0 : Math.max(...results.map((r) => r.percentage));

  return (
    <div className="container">
      <h2>User Dashboard</h2>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <div className="card">
          <h3>{totalAttempts}</h3>
          <p>Quizzes Attempted</p>
        </div>

        <div className="card">
          <h3>{avgScore}%</h3>
          <p>Average Score</p>
        </div>

        <div className="card">
          <h3>{bestScore}%</h3>
          <p>Best Score</p>
        </div>
      </div>

      {/* RECENT ATTEMPTS */}
      <div className="card" style={{ marginTop: "25px" }}>
        <h3>Recent Attempts</h3>

        {results.length === 0 ? (
          <p>No quizzes attempted yet.</p>
        ) : (
          results.slice(0, 5).map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span>{r.quizTitle}</span>
              <span>
                {r.score}/{r.total}
              </span>
              <span>{r.percentage}%</span>
            </div>
          ))
        )}
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/quizzes")}
      >
        Attempt New Quiz
      </button>
    </div>
  );
}
