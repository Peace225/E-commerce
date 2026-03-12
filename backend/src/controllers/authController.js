const admin = require('firebase-admin');
const db = admin.firestore();
const UserModel = require('../models/User');

exports.registerOrLogin = async (req, res) => {
  const { token, displayName, email, photoURL } = req.body;

  if (!token) return res.status(400).json({ error: "Token manquant" });

  try {
    // 1. Vérifier la validité du token avec Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    // 2. Si l'utilisateur n'existe pas encore dans Firestore, on le crée
    if (!userDoc.exists) {
      // Générer un code de parrainage unique (ex: RYNEK-1234)
      const referralCode = `RYNK-${Math.floor(1000 + Math.random() * 9000)}`;

      const newUser = UserModel({
        uid,
        email: email || decodedToken.email,
        displayName: displayName || "Utilisateur Rynek",
        photoURL: photoURL || "",
        role: "client", // Par défaut
        balance: 0,
        referralCode: referralCode,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await userRef.set(newUser);
      return res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
    }

    // 3. Si l'utilisateur existe déjà, on renvoie ses données (Login)
    res.status(200).json({ message: "Connexion réussie", user: userDoc.data() });

  } catch (error) {
    console.error("Erreur Auth:", error.message);
    res.status(401).json({ error: "Token invalide ou erreur serveur" });
  }
};
module.exports = router;