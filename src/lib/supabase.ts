import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Aviso: Supabase URL ou Anon Key não encontrados. Certifique-se de conectar a integração do Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);