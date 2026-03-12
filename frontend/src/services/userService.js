import { db } from "../utils/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const saveUserToFirestore = async (user) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      role: "user",
    });
  } catch (error) {
    console.error("Erreur Firestore :", error);
  }
};