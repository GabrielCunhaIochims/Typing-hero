// JS/supabase.js
const SUPABASE_URL = 'https://sfmcwsodsyjdxxqmxeen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbWN3c29kc3lqZHh4cW14ZWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NjM5MzcsImV4cCI6MjEwMTUzOTkzN30.m_p14VSR0JNb24TumsNxh3kYpNSS_mEMr_p4W-XVAzk';

// Declara a variável globalmente
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
