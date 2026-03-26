const { supabase } = require('../../index'); // 🔄 Client Supabase

/**
 * 💸 Gérer une demande de retrait (Withdrawal)
 */
exports.requestWithdrawal = async (req, res) => {
  const { uid, amount, method, paymentDetails } = req.body;

  // 1. Validations de base
  if (!uid || !amount || amount < 1000) {
    return res.status(400).json({ 
      error: "Montant invalide. Le minimum est de 1000 FCFA." 
    });
  }

  try {
    // 2. Vérification de l'utilisateur et de son solde
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, balance')
      .eq('id', uid)
      .single();

    if (userError || !user) {
      throw new Error("Utilisateur introuvable.");
    }

    const currentBalance = user.balance || 0;

    // Vérification du solde disponible
    if (currentBalance < amount) {
      throw new Error("Solde insuffisant pour ce retrait.");
    }

    // 3. Mise à jour du solde (Déduction immédiate)
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: currentBalance - amount })
      .eq('id', uid);

    if (updateError) throw updateError;

    // 4. Création de la trace dans la table 'withdrawals'
    const { error: insertError } = await supabase
      .from('withdrawals')
      .insert([{
        userId: uid, // ⚠️ Assure-toi que la colonne s'appelle bien 'userId' ou 'user_id' dans Supabase
        userEmail: user.email,
        amount: parseFloat(amount),
        method: method, // Orange Money, Wave, etc.
        paymentDetails: paymentDetails,
        status: 'en_attente',
        // createdAt et updatedAt sont généralement gérés automatiquement par Supabase (valeur par défaut : now())
        // Si tu n'as pas mis de valeur par défaut dans ta table, décommente la ligne suivante :
        // createdAt: new Date().toISOString() 
      }]);

    if (insertError) {
      // Cas rare : L'argent a été déduit mais la trace a échoué.
      console.error("⚠️ ALERTE : Trace de retrait non sauvegardée pour l'UID:", uid);
      throw insertError;
    }

    res.status(200).json({ 
      message: "Demande de retrait enregistrée avec succès ! 🚀" 
    });

  } catch (error) {
    console.error("Erreur retrait:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📈 Historique des paiements/retraits pour un utilisateur
 */
exports.getPaymentHistory = async (req, res) => {
  const { uid } = req.params;

  try {
    const { data: history, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('userId', uid)
      .order('createdAt', { ascending: false }); // orderBy('createdAt', 'desc')

    if (error) throw error;

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};