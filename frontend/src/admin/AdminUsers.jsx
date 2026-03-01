import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const attemptsSnap = await getDocs(collection(db, "attempts"));

    const attempts = attemptsSnap.docs.map(d => d.data());

    const data = usersSnap.docs.map(doc => {
      const userAttempts = attempts.filter(a => a.userId === doc.id);
      const avg =
        userAttempts.length === 0
          ? 0
          : Math.round(
              userAttempts.reduce((a, b) => a + b.percentage, 0) /
                userAttempts.length
            );

      return {
        id: doc.id,
        ...doc.data(),
        attempts: userAttempts.length,
        avgScore: avg,
      };
    });

    setUsers(data);
  };

  return (
    <div className="container">
      <h2>Users</h2>

      <div className="card">
        {users.map(u => (
          <div
            key={u.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>{u.name}</span>
            <span>{u.psid}</span>
            <span>{u.attempts}</span>
            <span>{u.avgScore}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
