import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { resetUserAttempts } from "../services/adminService";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  /* ---------------- FETCH ATTEMPTS ---------------- */
  const fetchAttempts = async (userId) => {
    const q = query(collection(db, "attempts"), where("userId", "==", userId));

    const snap = await getDocs(q);
    setAttempts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading users...</p>;
  }

  return (
    <div className="container">
      <h2>Manage Users</h2>

      {/* USER LIST */}
      <div className="card" style={{ marginTop: "15px" }}>
        <h3>Users</h3>

        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedUser(u);
              fetchAttempts(u.id);
            }}
          >
            <span>{u.name}</span>
            <span>{u.psid}</span>
          </div>
        ))}
      </div>

      {/* ATTEMPTS */}
      {selectedUser && (
        <div className="card" style={{ marginTop: "25px" }}>
          <h3>
            Attempts — {selectedUser.name} ({selectedUser.psid})
          </h3>

          {attempts.length === 0 ? (
            <p>No attempts yet.</p>
          ) : (
            attempts.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span>{a.quizTitle}</span>
                <span>{a.percentage}%</span>

                {/* 🔴 RESET BUTTON */}
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (window.confirm("Reset all attempts for this quiz?")) {
                      resetUserAttempts(selectedUser.id, a.quizId).then(() =>
                        fetchAttempts(selectedUser.id),
                      );
                    }
                  }}
                >
                  Reset Attempts
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
