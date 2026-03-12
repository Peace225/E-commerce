const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * 🟢 RÉCUPÉRER LE PROFIL UTILISATEUR
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    res.status(200).json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔴 DEMANDER UN RETRAIT
 */
exports.requestWithdrawal = async (req, res) => {
  const { amount, paymentMethod, phoneNumber } = req.body;
  
  // L'ID utilisateur vient du middleware verifyToken (req.user)
  const uid = req.user.uid; 

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(404).json({ error: "Utilisateur inconnu" });

    const currentBalance = userDoc.data().balance || 0;

    if (currentBalance < amount) {
      return res.status(400).json({ error: "Solde insuffisant pour ce retrait." });
    }

    // 1. Débiter le solde immédiatement (Sécurité)
    await userRef.update({
      balance: admin.firestore.FieldValue.increment(-amount)
    });

    // 2. Créer la demande dans une collection dédiée pour validation admin
    await db.collection('withdrawals').add({
      uid,
      amount,
      paymentMethod,
      phoneNumber,
      status: 'en_attente',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "Demande de retrait enregistrée avec succès !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};