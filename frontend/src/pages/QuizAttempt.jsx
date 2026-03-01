import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../services/quizService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const timerRef = useRef(null);

  /* ---------------- Fetch Quiz ---------------- */

  useEffect(() => {
    if (user) fetchQuiz();
  }, [user]);

  const fetchQuiz = async () => {
    try {
      const data = await getQuizById(id);

      // 🔒 Check attempt limit
      const q = query(
        collection(db, "attempts"),
        where("userId", "==", user.uid),
        where("quizId", "==", id),
      );

      const attemptSnap = await getDocs(q);
      const maxAttempts = data.maxAttempts ?? 1;

      if (attemptSnap.size >= maxAttempts) {
        alert(
          `You have reached the maximum attempts (${maxAttempts}) for this quiz.`,
        );
        navigate("/dashboard");
        return;
      }

      setQuiz(data);
      setTimeLeft((data.timeLimit || 5) * 60);
    } catch (err) {
      alert("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Timer ---------------- */

  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quiz, timeLeft]);

  /* ---------------- Auto Submit ---------------- */

  useEffect(() => {
    if (timeLeft === 0 && quiz) {
      submitQuiz();
    }
  }, [timeLeft]);

  /* ---------------- Handlers ---------------- */

  const handleOptionSelect = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    navigate(`/result/${id}`, {
      state: { quiz, answers },
      replace: true, // 🔥 prevents back/refresh duplicate saves
    });
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading quiz...</p>;
  }

  if (!quiz) {
    return <p>Quiz not found.</p>;
  }

  const question = quiz.questions[currentIndex];

  return (
    <div className="container">
      <div className="card">
        {/* TITLE + TIMER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2>{quiz.title}</h2>

          <div
            style={{
              fontWeight: "bold",
              color: timeLeft <= 30 ? "#ef4444" : "#facc15",
            }}
          >
            ⏱ {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <p>
          Question {currentIndex + 1} of {quiz.questions.length}
        </p>

        <h3 style={{ marginTop: "15px" }}>{question.question}</h3>

        <div style={{ marginTop: "15px" }}>
          {question.options.map((opt, index) => (
            <label
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                marginBottom: "10px",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "10px",
                cursor: "pointer",
                background:
                  answers[currentIndex] === index
                    ? "rgba(99,102,241,0.18)"
                    : "transparent",
              }}
            >
              {/* RADIO */}
              <input
                type="radio"
                name={`question-${currentIndex}`}
                checked={answers[currentIndex] === index}
                onChange={() => handleOptionSelect(index)}
                style={{
                  margin: 0,
                  width: "16px",
                  height: "16px",
                  accentColor: "#6366f1", // modern purple
                }}
              />

              {/* OPTION TEXT */}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                }}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            className="btn"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {currentIndex === quiz.questions.length - 1 ? (
            <button className="btn btn-primary" onClick={submitQuiz}>
              Submit Quiz
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={nextQuestion}
              disabled={answers[currentIndex] === undefined}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
