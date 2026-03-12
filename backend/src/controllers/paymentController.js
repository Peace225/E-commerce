const admin = require('firebase-admin');
const db = admin.firestore();

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
    const userRef = db.collection('users').doc(uid);

    // 2. Utilisation d'une transaction pour la sécurité financière
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error("Utilisateur introuvable.");
      }

      const currentBalance = userDoc.data().balance || 0;

      // Vérification du solde disponible
      if (currentBalance < amount) {
        throw new Error("Solde insuffisant pour ce retrait.");
      }

      // 3. Mise à jour du solde (Déduction immédiate)
      transaction.update(userRef, {
        balance: admin.firestore.FieldValue.increment(-amount)
      });

      // 4. Création de la trace dans la collection 'withdrawals'
      const withdrawalRef = db.collection('withdrawals').doc();
      transaction.set(withdrawalRef, {
        userId: uid,
        userEmail: userDoc.data().email,
        amount: parseFloat(amount),
        method: method, // Orange Money, Wave, etc.
        paymentDetails: paymentDetails,
        status: 'en_attente',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

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
    const snapshot = await db.collection('withdrawals')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};