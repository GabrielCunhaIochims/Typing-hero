// JS/supabase.js
const SUPABASE_URL = 'https://sfmcwsodsyjdxxqmxeen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbWN3c29kc3lqZHh4cW14ZWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NjM5MzcsImV4cCI6MjEwMTUzOTkzN30';

// Declara a variável globalmente
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
