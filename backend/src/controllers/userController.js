const { supabase } = require('../../index'); // 🔄 Client Supabase

/**
 * 🟢 RÉCUPÉRER LE PROFIL UTILISATEUR
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.uid) // On cherche l'utilisateur par son ID
      .single();
    
    if (error || !user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 DEMANDER UN RETRAIT
 */
exports.requestWithdrawal = async (req, res) => {
  const { amount, paymentMethod, phoneNumber } = req.body;
  
  // ⚠️ TRÈS IMPORTANT : Avec Supabase, l'identifiant s'appelle 'id', pas 'uid'
  const uid = req.user.id; 

  try {
    // 1. Récupérer l'utilisateur pour vérifier son solde
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "Utilisateur inconnu" });
    }

    const currentBalance = user.balance || 0;

    if (currentBalance < amount) {
      return res.status(400).json({ error: "Solde insuffisant pour ce retrait." });
    }

    // 2. Débiter le solde immédiatement (Sécurité)
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: currentBalance - amount })
      .eq('id', uid);

    if (updateError) throw updateError;

    // 3. Créer la demande dans la table 'withdrawals'
    const { error: insertError } = await supabase
      .from('withdrawals')
      .insert([{
        uid, // Attention : Vérifie si ta colonne s'appelle 'uid', 'userId' ou 'user_id' dans Supabase
        amount,
        paymentMethod,
        phoneNumber,
        status: 'en_attente'
        // Pas besoin de createdAt, PostgreSQL s'en charge avec 'now()'
      }]);

    if (insertError) throw insertError;

    res.status(200).json({ message: "Demande de retrait enregistrée avec succès !" });
  } catch (error) {
    console.error("Erreur retrait:", error);
    res.status(500).json({ error: error.message });
  }
};