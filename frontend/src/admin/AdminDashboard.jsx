import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    quizzes: 0,
    attempts: 0,
    avgScore: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const quizzesSnap = await getDocs(collection(db, "quizzes"));
    const attemptsSnap = await getDocs(collection(db, "attempts"));

    const attempts = attemptsSnap.docs.map((d) => d.data());
    const avg =
      attempts.length === 0
        ? 0
        : Math.round(
            attempts.reduce((a, b) => a + b.percentage, 0) / attempts.length,
          );

    setStats({
      users: usersSnap.size,
      quizzes: quizzesSnap.size,
      attempts: attemptsSnap.size,
      avgScore: avg,
    });
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <StatCard title="Users" value={stats.users} path="/admin/users" />

        <StatCard title="Quizzes" value={stats.quizzes} path="/admin/quizzes" />
        <StatCard title="Attempts" value={stats.attempts} />
        <StatCard title="Avg Score" value={`${stats.avgScore}%`} />
      </div>
    </div>
  );
}

function StatCard({ title, value, path }) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        cursor: path ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onClick={() => path && navigate(path)}
      onMouseEnter={(e) => {
        if (path) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <h1>{value}</h1>
      <p>{title}</p>
    </div>
  );
}
