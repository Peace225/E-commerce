const { supabase } = require('../config/supabaseClient');

const protect = async (req, res, next) => {
  try {
    // 1. Vérifier le header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Accès refusé. Token manquant" });
    }

    const token = authHeader.split(' ')[1];

    // 2. Valider le token avec Supabase (service key = pas de RLS)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError ||!user) {
      return res.status(401).json({ error: "Session expirée ou token invalide" });
    }

    req.user = user;

    // 3. Upsert minimal dans profiles (ne bloque pas si ça échoue)
    const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(
        {
          id: user.id,
          email: user.email,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.warn("⚠️ upsert profiles:", upsertError.message);
    }

    return next();

  } catch (e) {
    console.error("🚨 protect middleware:", e);
    return res.status(500).json({ error: "Erreur serveur auth" });
  }
};

module.exports = { protect };