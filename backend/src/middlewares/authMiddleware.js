// 3. 🆕 Si l'utilisateur n'existe pas encore, on le crée
    if (!existingUser) {
      
      // 🚨 TEST EXPRESS : On n'envoie que l'ID et l'Email pour voir si ça passe !
      const newUser = {
        id: uid,
        email: email
        // J'ai désactivé tout le reste temporairement :
        // displayName: displayName || "Utilisateur Rynek",
        // photoURL: photoURL || "",
        // role: role || "client",
        // balance: 0,
        // referralCode: referralCode
      };

      // 💾 On insère le nouvel utilisateur dans la table
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([newUser]) 
        .select()
        .single();

      if (insertError) {
         // 👉 C'EST ÇA QU'ON VEUT VOIR DANS LE TERMINAL SI ÇA PLANTE !
         console.error("🚨 ERREUR SUPABASE INSERTION:", insertError);
         throw insertError;
      }

      return res.status(201).json({ message: "Utilisateur créé avec succès", user: insertedUser });
    }