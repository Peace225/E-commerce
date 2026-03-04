import { db } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Ajouter une boutique
export const createBoutique = async (data) => {
  const boutiquesRef = collection(db, "boutiques");
  return await addDoc(boutiquesRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// Récupérer les boutiques d’un utilisateur
export const getBoutiquesByUser = async (userId) => {
  const q = query(collection(db, "boutiques"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Supprimer une boutique
export const deleteBoutique = async (id) => {
  return await deleteDoc(doc(db, "boutiques", id));
};