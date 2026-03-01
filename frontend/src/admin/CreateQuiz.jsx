import { useState } from "react";
import { createQuiz } from "../services/quizService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(5); // minutes

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ]);

  /* -------- Question handlers -------- */

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
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

  /* -------- Option handlers -------- */

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

  /* -------- Save -------- */

  const handleSubmit = async () => {
    await createQuiz({
      title,
      description,
      timeLimit,
      questions,
      createdBy: user.uid,
    });
    navigate("/admin/quizzes");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Quiz</h2>

        <input
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Quiz Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginTop: "10px", width: "100%" }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <label style={{ opacity: 0.8 }}>Time Limit:</label>

          <input
            type="number"
            min="1"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "6px 8px",
              textAlign: "center",
            }}
          />

          <span style={{ opacity: 0.8 }}>minutes</span>
        </div>

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
              placeholder="Question"
              value={q.question}
              onChange={(e) => {
                const updated = [...questions];
                updated[qIndex].question = e.target.value;
                setQuestions(updated);
              }}
            />

            {q.options.map((opt, oIndex) => (
              <div
                key={oIndex}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr 28px",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                {/* Correct answer */}
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswerIndex === oIndex}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIndex].correctAnswerIndex = oIndex;
                    setQuestions(updated);
                  }}
                />

                {/* Option input */}
                <input
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    updateOptionText(qIndex, oIndex, e.target.value)
                  }
                  style={{
                    flex: 1,
                  }}
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

        <button className="btn btn-primary" onClick={handleSubmit}>
          Save Quiz
        </button>
      </div>
    </div>
  );
}
