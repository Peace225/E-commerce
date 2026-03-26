import { createClient } from '@supabase/supabase-js'

// Ces informations viennent de ta capture d'écran
const supabaseUrl = 'https://sscewoygugiprntrcabp.supabase.co'
const supabaseKey = 'sb_publishable_vUOqlTlz6RCtyh6wvNWE7g__rVdHC2u' // ⚠️ Copie bien TOUTE la clé avec le bouton "Copie"

export const supabase = createClient(supabaseUrl, supabaseKey)