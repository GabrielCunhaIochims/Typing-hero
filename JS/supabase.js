// JS/supabase.js
const SUPABASE_URL = 'SUA_SUPABASE_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_SUPABASE_ANON_KEY_AQUI';

// Declara a variável globalmente
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
