const { supabase } = require('../config/supabaseClient'); // 🔄 Import propre !
// On n'importe pas forcément UserModel si on formate les données directement ici, 
// mais tu peux le remettre si ton modèle nettoie des choses spécifiques.

exports.registerOrLogin = async (req, res) => {
  try {
    // 1. 🔐 On récupère les infos depuis le "douanier" (le middleware protect)
    // Pas besoin de vérifier le token, s'il arrive ici c'est que le douanier l'a validé !
    const uid = req.user.id;
    const email = req.user.email;
    
    // On récupère d'éventuelles infos envoyées par React (comme le rôle choisi lors de l'inscription)
    const { displayName, photoURL, role } = req.body; 

    // 2. 🔍 Vérifier si l'utilisateur existe déjà dans la table 'users'
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle(); 

    if (fetchError) throw fetchError;

    // 3. 🆕 Si l'utilisateur n'existe pas encore, on le crée
    if (!existingUser) {
      // Générer un code de parrainage unique
      const referralCode = `RYNK-${Math.floor(1000 + Math.random() * 9000)}`;

      const newUser = {
        id: uid,
        email: email,
        displayName: displayName || "Utilisateur Rynek",
        photoURL: photoURL || "",
        role: role || "client", // 'vendeur' si ça vient du formulaire vendeur, sinon 'client'
        balance: 0,
        referralCode: referralCode
      };

      // 💾 On insère le nouvel utilisateur dans la table
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([newUser]) 
        .select()
        .single();

      if (insertError) throw insertError;

      return res.status(201).json({ message: "Utilisateur créé avec succès", user: insertedUser });
    }

    // 4. ✅ Si l'utilisateur existe déjà, on renvoie ses données (Login)
    res.status(200).json({ message: "Connexion réussie", user: existingUser });

  } catch (error) {
    console.error("Erreur Auth:", error.message);
    res.status(500).json({ error: "Erreur serveur lors de la synchronisation" });
  }
};