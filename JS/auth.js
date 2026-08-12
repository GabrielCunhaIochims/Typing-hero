// 1. Inicialização OBRIGATÓRIA no topo do arquivo
const SUPABASE_URL = 'https://sfmcwsodsyjdxxqmxeen.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbWN3c29kc3lqZHh4cW14ZWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NjM5MzcsImV4cCI6MjEwMTUzOTkzN30.m_p14VSR0JNb24TumsNxh3kYpNSS_mEMr_p4W-XVAzk';

// Certifique-se de que a variável _supabase é criada antes de ser usada
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// 2. Alterna entre as abas 'login' e 'register'
function switchTab(tab) {
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');

  document.getElementById('loginError').textContent = '';
  document.getElementById('regError').textContent = '';
  document.getElementById('regSuccess').textContent = '';

  if (tab === 'login') {
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formRegister.classList.add('active');
    formLogin.classList.remove('active');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
  }
}

// 3. Manipula o formulário de Login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginError');
  const btnLogin = document.getElementById('btnLogin');

  errorMsg.textContent = '';
  btnLogin.disabled = true;
  btnLogin.textContent = 'CARREGANDO...';

  try {
    const { data, error } = await _supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    window.location.href = 'index.html';
  } catch (err) {
    errorMsg.textContent = translateError(err.message);
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = 'ENTRAR NO JOGO';
  }
}

// 4. Manipula o formulário de Cadastro
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorMsg = document.getElementById('regError');
  const successMsg = document.getElementById('regSuccess');
  const btnRegister = document.getElementById('btnRegister');

  errorMsg.textContent = '';
  successMsg.textContent = '';
  btnRegister.disabled = true;
  btnRegister.textContent = 'CRIANDO CONTA...';

  try {
    const { data, error } = await _supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) throw error;

    if (data.session) {
      window.location.href = 'index.html';
    } else {
      successMsg.textContent = 'Conta criada! Verifique seu e-mail para confirmar.';
      document.getElementById('formRegister').reset();
    }
  } catch (err) {
    errorMsg.textContent = translateError(err.message);
  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = 'CRIAR CONTA';
  }
}

// 5. Verifica sessão atual ao carregar a página
async function checkUserSession() {
  const { data: { user } } = await _supabase.auth.getUser();
  const userInfo = document.getElementById('userInfo');
  const authActionBtn = document.getElementById('authActionBtn');

  if (user) {
    currentUser = user;
    const nick = user.user_metadata?.display_name || user.email.split('@')[0];
    if (userInfo) userInfo.textContent = `🎮 ${nick}`;
    if (authActionBtn) {
      authActionBtn.textContent = 'Sair';
      authActionBtn.href = '#';
      authActionBtn.onclick = async (e) => {
        e.preventDefault();
        await _supabase.auth.signOut();
        window.location.reload();
      };
    }
  } else {
    currentUser = null;
    if (userInfo) userInfo.textContent = '👤 Jogador Convidado';
    if (authActionBtn) {
      authActionBtn.textContent = 'Entrar / Cadastrar';
      authActionBtn.href = 'auth.html';
      authActionBtn.onclick = null;
    }
  }
}

// 6. Tradução de erros comuns
function translateError(message) {
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (message.includes('User already registered')) return 'Este e-mail já está cadastrado.';
  if (message.includes('Password should be at least')) return 'A senha deve ter no mínimo 6 caracteres.';
  return message;
}

document.addEventListener('DOMContentLoaded', checkUserSession);