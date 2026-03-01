import { useEffect, useState } from "react";
import { getAllQuizzes, deleteQuiz } from "../services/quizService";
import { useNavigate } from "react-router-dom";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;

    await deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading quizzes...</p>;
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Manage Quizzes</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/create-quiz")}
        >
          + New Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div>
              <h3>{quiz.title}</h3>
              <p>Questions: {quiz.questions?.length || 0}</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn"
                onClick={() => navigate(`/admin/edit-quiz/${quiz.id}`)}
              >
                Edit
              </button>

              <button className="btn" onClick={() => handleDelete(quiz.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
