import { supabase } from "../utils/supabaseClient"; // 🔄 On utilise maintenant Supabase

// 🏪 Ajouter une boutique (Create)
export const createBoutique = async (data) => {
  const { data: newBoutique, error } = await supabase
    .from('boutiques') // Nom de ta table dans Supabase
    .insert([
      {
        ...data,
        // Pas besoin de serverTimestamp(), Supabase (PostgreSQL) 
        // gère souvent le 'created_at' automatiquement avec 'now()'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Erreur création boutique:", error.message);
    throw error;
  }
  return newBoutique;
};

// 🔍 Récupérer les boutiques d’un utilisateur (Read)
export const getBoutiquesByUser = async (userId) => {
  const { data, error } = await supabase
    .from('communities') // Vérifie si ta table s'appelle 'boutiques' ou 'shops'
    .select('*')
    .eq('userId', userId); // Filtre 'where' de Supabase

  if (error) {
    console.error("Erreur récupération boutiques:", error.message);
    throw error;
  }
  return data; // Retourne directement le tableau d'objets
};

// 🗑️ Supprimer une boutique (Delete)
export const deleteBoutique = async (id) => {
  const { error } = await supabase
    .from('boutiques')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur suppression boutique:", error.message);
    throw error;
  }
  return true;
};