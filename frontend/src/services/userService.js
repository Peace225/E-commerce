import { supabase } from "../utils/supabaseClient"; 

/**
 * 👤 Enregistrer ou mettre à jour un utilisateur dans Supabase
 */
export const saveUserToSupabase = async (user) => {
  try {
    // Dans Supabase, l'ID unique s'appelle 'id' (et non 'uid' comme Firebase)
    const { data, error } = await supabase
      .from('users')
      .upsert([ // 'upsert' insère s'il n'existe pas, met à jour s'il existe déjà
        {
          id: user.id, // ⚠️ Assure-toi d'utiliser .id et non .uid
          email: user.email,
          role: "client", // Ton rôle par défaut (ex: 'client')
          // Pas besoin de serverTimestamp(), la colonne created_at 
          // de Supabase est gérée automatiquement par PostgreSQL.
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    console.log("✅ Utilisateur enregistré dans la base Supabase !");
    return data;

  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement de l'utilisateur :", error.message);
    throw error;
  }
};