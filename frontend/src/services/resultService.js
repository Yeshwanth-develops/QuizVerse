import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const resultsRef = collection(db, "results");

export const saveResult = async ({
  userId,
  quizId,
  quizTitle,
  score,
  total,
  percentage,
  answers,
}) => {
  await addDoc(resultsRef, {
    userId,
    quizId,
    quizTitle,
    score,
    total,
    percentage,
    answers,
    createdAt: serverTimestamp(),
  });
};
