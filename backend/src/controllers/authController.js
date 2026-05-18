const { supabase } = require('../config/supabaseClient');

const registerOrLogin = async (req, res) => {
  try {
    const uid = req.user.id;
    const email = req.user.email;
    const { displayName, photoURL, role, metadata } = req.body || {};

    // 1. Vérifier si le profil existe
    const { data: existingUser, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

    if (fetchError) throw fetchError;
    if (existingUser) {
      return res.status(200).json({ message: "Connexion réussie", user: existingUser });
    }

    // 2. Créer le profil
    const referralCode = `RY-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

    const newUser = {
      id: uid,
      email,
      full_name: displayName || metadata?.full_name || "Utilisateur Rynek",
      avatar_url: photoURL || metadata?.avatar_url || "",
      role: role || "client",
      referral_code: referralCode,
      balance: 0,
      total_sales: 0,
      total_referrals: 0,
      rank: "Bronze",
      referral_earnings: 0,
      total_clicks: 0,
      is_admin: false,
      shop_status: "pending",
      is_banned: false,
      terms_accepted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertedUser, error: insertError } = await supabase
    .from('profiles')
    .insert([newUser])
    .select()
    .single();

    if (insertError) {
      console.error("🚨 INSERT profiles:", insertError);
      return res.status(500).json({ error: "Erreur création profil", details: insertError.message });
    }

    return res.status(201).json({ message: "Utilisateur créé", user: insertedUser });

  } catch (error) {
    console.error("registerOrLogin:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { registerOrLogin };