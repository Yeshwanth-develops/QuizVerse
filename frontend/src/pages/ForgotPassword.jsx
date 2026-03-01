import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ width: "400px" }}>
        <h2>Reset Password</h2>

        <input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginTop: "15px" }}
        />

        <button
          className="btn btn-primary"
          onClick={handleReset}
          style={{ width: "100%", marginTop: "15px" }}
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
