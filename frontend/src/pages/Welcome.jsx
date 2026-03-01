import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div
      className="container"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ textAlign: "center", maxWidth: "520px" }}>
        <h1>Welcome to QuizVerse</h1>
        <h3 style={{ fontWeight: "400", margin: "10px 0 20px" }}>
          Quiz Platform
        </h3>

        <p style={{ color: "var(--muted)", marginBottom: "25px" }}>
          Login to participate in quizzes and track your performance.
        </p>

        <Link to="/login">
          <button className="btn btn-primary">Login to Enter</button>
        </Link>
      </div>
    </div>
  );
}
