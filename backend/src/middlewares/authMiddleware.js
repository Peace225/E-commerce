const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: "Accès refusé. Token manquant." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // On attache l'utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ error: "Session expirée ou Token invalide." });
  }
};

module.exports = verifyToken;