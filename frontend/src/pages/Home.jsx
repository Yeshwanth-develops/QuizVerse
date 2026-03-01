import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      {/* Welcome */}
      <div className="card" style={{ marginBottom: "25px" }}>
        <h1>👋 Welcome to QuizMaster</h1>
        <p style={{ opacity: 0.8, marginTop: "8px" }}>
          Test your knowledge, track your progress, and challenge yourself.
        </p>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card">
          <h3>📚 Take a Quiz</h3>
          <p style={{ opacity: 0.8, margin: "10px 0" }}>
            Browse available quizzes and start instantly.
          </p>
          <Link to="/quizzes">
            <button className="btn btn-primary">View Quizzes</button>
          </Link>
        </div>

        <div className="card">
          <h3>📊 Dashboard</h3>
          <p style={{ opacity: 0.8, margin: "10px 0" }}>
            View your attempts and performance.
          </p>
          <Link to="/dashboard">
            <button className="btn">Go to Dashboard</button>
          </Link>
        </div>
      </div>

      {/* Placeholder for future */}
      <div className="card">
        <h3>🚀 Coming Soon</h3>
        <ul style={{ marginTop: "10px", opacity: 0.85 }}>
          <li>✔ Quiz history</li>
          <li>✔ Leaderboards</li>
          <li>✔ Time-based challenges</li>
        </ul>
      </div>
    </div>
  );
}
