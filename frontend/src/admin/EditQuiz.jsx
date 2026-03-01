import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, updateQuiz } from "../services/quizService";
import { getAllUsers, updateQuizAccess } from "../services/adminService";

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    loadUsers();
  }, []);

  const fetchQuiz = async () => {
    try {
      const quiz = await getQuizById(id);

      setIsRestricted(quiz.isRestricted || false);
      setAssignedUsers(
        Array.isArray(quiz.assignedUsers) ? quiz.assignedUsers : [],
      );

      setTitle(quiz.title);
      setDescription(quiz.description || "");
      setTimeLimit(quiz.timeLimit || 5); // ✅ FIXED
      setQuestions(
        quiz.questions?.map((q) => ({
          ...q,
          correctAnswerIndex: q.correctAnswerIndex ?? 0,
        })) || [],
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Question handlers ---------------- */

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
  };

  const removeQuestion = (qIndex) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const updateQuestionText = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const updateOptionText = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    if (updated[qIndex].correctAnswerIndex === oIndex) {
      updated[qIndex].correctAnswerIndex = 0;
    }
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswerIndex = oIndex;
    setQuestions(updated);
  };

  /* ---------------- Save ---------------- */

  const saveQuiz = async () => {
    try {
      await updateQuiz(id, {
        title,
        description,
        timeLimit, // ✅ FIXED
        questions,
      });
      await updateQuizAccess(
        id,
        isRestricted,
        isRestricted ? assignedUsers : [],
      );

      navigate("/admin/quizzes");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading quiz...</p>;

  return (
    <div className="container">
      <button
        className="btn"
        style={{ marginBottom: "15px" }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="card">
        <h2>Edit Quiz</h2>

        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginTop: "10px", width: "100%" }}
        />

        {/* TIMER */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <label>Time Limit:</label>
          <input
            type="number"
            min="1"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            style={{ width: "80px" }}
          />
          <span>minutes</span>
        </div>

        <hr style={{ margin: "25px 0" }} />

        <h3>Quiz Access</h3>

        <label style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
          <input
            type="checkbox"
            checked={isRestricted}
            onChange={(e) => setIsRestricted(e.target.checked)}
          />
          Restrict this quiz to selected users
        </label>

        {isRestricted && (
          <>
            {/* SEARCH */}
            <input
              placeholder="Search by name or PSID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: "12px" }}
            />

            {/* SELECTED USERS */}
            {assignedUsers.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <small style={{ opacity: 0.6 }}>Selected Users</small>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "6px",
                  }}
                >
                  {users
                    .filter((u) => assignedUsers.includes(u.uid))
                    .map((u) => (
                      <div
                        key={u.uid}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "20px",
                          background: "rgba(99,102,241,0.15)",
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        {u.name} ({u.psid})
                        <span
                          style={{ cursor: "pointer", opacity: 0.7 }}
                          onClick={() =>
                            setAssignedUsers((prev) =>
                              prev.filter((id) => id !== u.uid),
                            )
                          }
                        >
                          ✕
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* USER LIST */}
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
              }}
            >
              {users
                .filter((u) => {
                  const nameMatch =
                    u.name?.toLowerCase().includes(search.toLowerCase()) ||
                    String(u.psid || "").includes(search);

                  const psidMatch = String(u.psid || "").includes(search);

                  return nameMatch || psidMatch;
                })

                .map((u) => {
                  const selected = assignedUsers.includes(u.uid);

                  return (
                    <div
                      key={u.uid}
                      onClick={() =>
                        setAssignedUsers((prev) =>
                          selected
                            ? prev.filter((id) => id !== u.uid)
                            : [...prev, u.uid],
                        )
                      }
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        cursor: "pointer",
                        background: selected
                          ? "rgba(99,102,241,0.12)"
                          : "transparent",
                      }}
                    >
                      <span>
                        {u.name}{" "}
                        <small style={{ opacity: 0.6 }}>({u.psid})</small>
                      </span>

                      {selected && <span>✔</span>}
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* QUESTIONS */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="card" style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Question {qIndex + 1}</h3>
              <button
                className="btn-icon"
                onClick={() => removeQuestion(qIndex)}
              >
                ❌
              </button>
            </div>

            <input
              value={q.question}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
            />

            {q.options.map((opt, oIndex) => (
              <div
                key={oIndex}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 28px",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswerIndex === oIndex}
                  onChange={() => setCorrectAnswer(qIndex, oIndex)}
                />

                <input
                  value={opt}
                  onChange={(e) =>
                    updateOptionText(qIndex, oIndex, e.target.value)
                  }
                />

                <button
                  className="btn-icon"
                  onClick={() => removeOption(qIndex, oIndex)}
                >
                  ❌
                </button>
              </div>
            ))}

            <button className="btn" onClick={() => addOption(qIndex)}>
              + Add Option
            </button>
          </div>
        ))}

        <button className="btn" onClick={addQuestion}>
          + Add Question
        </button>

        <button className="btn btn-primary" onClick={saveQuiz}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
