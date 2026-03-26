const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;

// ✅ ON UTILISE LE BON NOM ICI : SUPABASE_SERVICE_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 ERREUR : Les clés Supabase sont introuvables. Vérifie le fichier .env !");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };