import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/* ===================== SIGNUP ===================== */

export const signup = async (psid, name, email, password) => {
  // Validate PSID
  if (!/^\d{5}$/.test(psid)) {
    throw new Error("PSID must be a 5-digit number");
  }

  // Check if PSID already exists
  const psidRef = doc(db, "psidIndex", psid);
  const psidSnap = await getDoc(psidRef);

  if (psidSnap.exists()) {
    throw new Error("PSID already registered");
  }

  // Create Firebase Auth user
  const res = await createUserWithEmailAndPassword(auth, email, password);

  // Store user profile
  await setDoc(doc(db, "users", res.user.uid), {
    psid,
    name,
    email,
    role: "user",
    createdAt: new Date(),
  });

  // Create PSID → UID + email mapping
  await setDoc(psidRef, {
    uid: res.user.uid,
    email,
  });

  return res.user;
};

/* ===================== LOGIN (PSID) ===================== */

export const login = async (psid, password) => {
  // Validate PSID
  if (!/^\d{5}$/.test(psid)) {
    throw new Error("Invalid PSID format");
  }

  const psidRef = doc(db, "psidIndex", psid);
  const psidSnap = await getDoc(psidRef);

  if (!psidSnap.exists()) {
    throw new Error("Invalid PSID or password");
  }

  const { email } = psidSnap.data();
  const res = await signInWithEmailAndPassword(auth, email, password);

  return res.user;
};

/* ===================== LOGOUT ===================== */

export const logout = async () => {
  await signOut(auth);
};
