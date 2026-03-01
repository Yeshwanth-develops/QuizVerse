import { collection, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

/* Reset attempts of a user for a quiz */
export const resetUserAttempts = async (userId, quizId) => {
  const q = query(
    collection(db, "attempts"),
    where("userId", "==", userId),
    where("quizId", "==", quizId)
  );

  const snap = await getDocs(q);

  const deletes = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletes);
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({
    uid: d.id,
    ...d.data(),
  }));
};

export const updateQuizAccess = async (
  quizId,
  isRestricted,
  assignedUsers
) => {
  const quizRef = doc(db, "quizzes", quizId);

  await updateDoc(quizRef, {
    isRestricted,
    assignedUsers,
  });
};