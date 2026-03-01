import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const savedRef = useRef(false); // 🔒 prevents duplicate saves

  if (!state) {
    return <p style={{ textAlign: "center" }}>No result data found.</p>;
  }

  const { quiz, answers } = state;

  let score = 0;
  quiz.questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswerIndex) {
      score++;
    }
  });

  const percentage = Math.round((score / quiz.questions.length) * 100);

  /* ---------------- SAVE ATTEMPT (SAFE) ---------------- */
  useEffect(() => {
    if (!user || savedRef.current) return;

    savedRef.current = true; // 🚫 block further runs

    const saveAttempt = async () => {
      try {
        await addDoc(collection(db, "attempts"), {
          userId: user.uid,
          quizId: id,
          quizTitle: quiz.title,
          score,
          total: quiz.questions.length,
          percentage,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to save attempt", err);
      }
    };

    saveAttempt();
  }, [user]);
  /* ---------------------------------------------------- */

  return (
    <div className="container">
      <div className="card">
        <h2>{quiz.title} – Result</h2>

        <p>
          Score: <b>{score}</b> / {quiz.questions.length}
        </p>

        <p>
          Percentage: <b>{percentage}%</b>
        </p>

        <hr style={{ margin: "15px 0" }} />

        {quiz.questions.map((q, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <h4>
              Q{index + 1}. {q.question}
            </h4>

            {q.options.map((opt, oIndex) => {
              const isCorrect = oIndex === q.correctAnswerIndex;
              const isSelected = answers[index] === oIndex;

              let color = "#ccc";
              if (isCorrect) color = "#22c55e";
              else if (isSelected) color = "#ef4444";

              return (
                <div
                  key={oIndex}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    marginTop: "4px",
                    border: `1px solid ${color}`,
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        ))}

        <button
          className="btn btn-primary"
          onClick={() => navigate("/quizzes")}
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
}
