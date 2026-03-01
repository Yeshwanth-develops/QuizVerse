import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const quizzesRef = collection(db, "quizzes");

// ---------------- ADMIN ----------------

export const createQuiz = async (quizData) => {
  await addDoc(quizzesRef, {
    ...quizData,
    createdAt: serverTimestamp(),
    isActive: true,
  });
};

export const getAllQuizzes = async () => {
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const getQuizById = async (id) => {
  const snap = await getDoc(doc(db, "quizzes", id));
  if (!snap.exists()) throw new Error("Quiz not found");
  return { id: snap.id, ...snap.data() };
};

export const updateQuiz = async (id, data) => {
  await updateDoc(doc(db, "quizzes", id), data);
};

export const deleteQuiz = async (id) => {
  await deleteDoc(doc(db, "quizzes", id));
};

// ---------------- USER ----------------

export const getActiveQuizzes = async () => {
  const q = query(quizzesRef, where("isActive", "==", true));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
