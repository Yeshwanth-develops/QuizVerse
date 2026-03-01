import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActiveQuizzes } from "../services/quizService";
import { useAuth } from "../context/AuthContext";

export default function QuizList() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getActiveQuizzes();
      setQuizzes(data);
    } catch (err) {
      alert("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const visibleQuizzes = quizzes.filter((quiz) => {
    if (!quiz.isRestricted) return true;
    if (quiz.assignedUsers?.includes(user.uid)) return false;
    return true;
  });

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading quizzes...</p>;
  }

  return (
    <div className="container">
      <h2>Available Quizzes</h2>

      {visibleQuizzes.length === 0 ? (
        <p>No quizzes available right now.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {visibleQuizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <h3>{quiz.title}</h3>

              {quiz.description && (
                <p style={{ margin: "8px 0" }}>{quiz.description}</p>
              )}

              <p>
                Questions: <b>{quiz.questions?.length || 0}</b>
              </p>

              <Link to={`/quiz/${quiz.id}`}>
                <button className="btn btn-primary">Start Quiz</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
